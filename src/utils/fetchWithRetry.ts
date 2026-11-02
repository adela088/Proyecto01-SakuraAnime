const delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

export async function fetchWithRetry(
  url: string,
  options?: RequestInit,
  maxRetries = 4,
  baseDelay = 1200,
  timeoutMs = 12000
): Promise<Response> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const requestController = new AbortController();
    const callerSignal = options?.signal;
    const abortRequest = () => requestController.abort(callerSignal?.reason);
    callerSignal?.addEventListener('abort', abortRequest, { once: true });
    if (callerSignal?.aborted) abortRequest();

    const timeoutId = setTimeout(
      () => requestController.abort(new DOMException('La petición excedió el tiempo de espera.', 'TimeoutError')),
      timeoutMs
    );

    let response: Response;
    try {
      response = await fetch(url, { ...options, signal: requestController.signal });
    } catch (error: unknown) {
      if (callerSignal?.aborted) throw error;
      if (requestController.signal.aborted) {
        throw new Error('La petición excedió el tiempo de espera.');
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
      callerSignal?.removeEventListener('abort', abortRequest);
    }

    if (response.status !== 429) {
      return response;
    }

    if (attempt === maxRetries) {
      return response;
    }

    const retryAfterHeader = response.headers.get('Retry-After');
    const retryAfterSeconds = retryAfterHeader
      ? Number.parseInt(retryAfterHeader, 10)
      : Number.NaN;
    const waitMs = Number.isFinite(retryAfterSeconds)
      ? retryAfterSeconds * 1000
      : baseDelay * Math.pow(2, attempt);

    await delay(waitMs);
  }

  throw new Error('No se pudo completar la petición.');
}

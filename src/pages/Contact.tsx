import React, { useState, useRef } from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { ContactFormData, ContactFormErrors } from '../types/anime';
import { ConfirmationDialog, ConfirmationDialogHandle } from '../components/ConfirmationDialog';
import { useToast } from '../context/ToastContext';

export const Contact: React.FC = () => {
  const { showToast } = useToast();
  const confirmDialogRef = useRef<ConfirmationDialogHandle>(null);

  const [formData, setFormData] = useState<ContactFormData>({
    nombre: '',
    email: '',
    mensaje: '',
  });

  const [touched, setTouched] = useState<{ [K in keyof ContactFormData]?: boolean }>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (): ContactFormErrors => {
    const errors: ContactFormErrors = {};

    if (!formData.nombre.trim()) {
      errors.nombre = 'El nombre es obligatorio';
    } else if (formData.nombre.trim().length < 3) {
      errors.nombre = 'El nombre debe tener al menos 3 caracteres';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'El email es obligatorio';
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = 'Ingresa un email válido';
    }

    if (!formData.mensaje.trim()) {
      errors.mensaje = 'El mensaje es obligatorio';
    } else if (formData.mensaje.trim().length < 10) {
      errors.mensaje = 'El mensaje debe tener al menos 10 caracteres';
    }

    return errors;
  };

  const errors = validate();
  const isFormValid =
    formData.nombre.trim().length >= 3 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()) &&
    formData.mensaje.trim().length >= 10;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBlur = (field: keyof ContactFormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ nombre: true, email: true, mensaje: true });

    if (isFormValid) {
      confirmDialogRef.current?.open();
    }
  };

  const handleConfirmedSubmit = () => {
    setSubmitted(true);
    showToast('✓ Mensaje enviado exitosamente. Nos pondremos en contacto pronto.', 'success');
    setFormData({ nombre: '', email: '', mensaje: '' });
    setTouched({});
  };

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12 space-y-8 animate-in fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display">
          Contacto
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Envíanos tus sugerencias o consultas sobre SakuraAnime
        </p>
      </div>

      {submitted && (
        <div
          role="status"
          aria-live="polite"
          className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center gap-3 animate-in fade-in"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <p className="text-sm font-medium">
            ¡Gracias por escribirnos! Tu mensaje ha sido recibido por el equipo de SakuraAnime.
          </p>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
        <form onSubmit={handlePreSubmit} noValidate className="space-y-6">
          <div className="space-y-1.5">
            <label
              htmlFor="nombre"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
            >
              Nombre:
            </label>
            <div className="relative">
              <input
                id="nombre"
                name="nombre"
                type="text"
                value={formData.nombre}
                onChange={handleChange}
                onBlur={() => handleBlur('nombre')}
                placeholder="Tu nombre completo..."
                aria-invalid={touched.nombre && !!errors.nombre}
                aria-describedby={touched.nombre && errors.nombre ? 'nombre-error' : undefined}
                className={`w-full px-4 py-3 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 border transition-all focus:outline-none focus:ring-2 ${
                  touched.nombre && errors.nombre
                    ? 'border-rose-500 focus:ring-rose-500/20'
                    : 'border-slate-200 dark:border-slate-700 focus:border-rose-500 focus:ring-rose-500/20'
                }`}
              />
            </div>
            {touched.nombre && errors.nombre && (
              <p id="nombre-error" role="alert" className="text-xs text-rose-500 flex items-center gap-1 mt-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.nombre}</span>
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
            >
              Email:
            </label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={() => handleBlur('email')}
                placeholder="tu@correo.com"
                aria-invalid={touched.email && !!errors.email}
                aria-describedby={touched.email && errors.email ? 'email-error' : undefined}
                className={`w-full px-4 py-3 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 border transition-all focus:outline-none focus:ring-2 ${
                  touched.email && errors.email
                    ? 'border-rose-500 focus:ring-rose-500/20'
                    : 'border-slate-200 dark:border-slate-700 focus:border-rose-500 focus:ring-rose-500/20'
                }`}
              />
            </div>
            {touched.email && errors.email && (
              <p id="email-error" role="alert" className="text-xs text-rose-500 flex items-center gap-1 mt-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.email}</span>
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="mensaje"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
            >
              Mensaje:
            </label>
            <div className="relative">
              <textarea
                id="mensaje"
                name="mensaje"
                rows={4}
                value={formData.mensaje}
                onChange={handleChange}
                onBlur={() => handleBlur('mensaje')}
                placeholder="Escribe tu mensaje o sugerencia aquí (mínimo 10 caracteres)..."
                aria-invalid={touched.mensaje && !!errors.mensaje}
                aria-describedby={touched.mensaje && errors.mensaje ? 'mensaje-error' : undefined}
                className={`w-full px-4 py-3 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 border transition-all focus:outline-none focus:ring-2 resize-none ${
                  touched.mensaje && errors.mensaje
                    ? 'border-rose-500 focus:ring-rose-500/20'
                    : 'border-slate-200 dark:border-slate-700 focus:border-rose-500 focus:ring-rose-500/20'
                }`}
              />
            </div>
            {touched.mensaje && errors.mensaje && (
              <p id="mensaje-error" role="alert" className="text-xs text-rose-500 flex items-center gap-1 mt-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.mensaje}</span>
              </p>
            )}
          </div>


          <div className="pt-2">
            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full py-3.5 px-6 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md ${
                isFormValid
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-rose-500/30 cursor-pointer hover:scale-[1.01]'
                  : 'bg-slate-300 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-60'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>Enviar mensaje</span>
            </button>
          </div>
        </form>
      </div>

      <ConfirmationDialog
        ref={confirmDialogRef}
        title="¿Confirmar envío del mensaje?"
        message={`¿Deseas enviar tu mensaje a nombre de "${formData.nombre}" (${formData.email})?`}
        confirmLabel="Enviar ahora"
        cancelLabel="Revisar"
        onConfirm={handleConfirmedSubmit}
        variant="info"
      />
    </main>
  );
};

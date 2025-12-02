export const whatsappTemplates = {
  // Recordatorio de cita próxima
  appointmentReminder: (
    nombreDueno: string,
    nombreMascota: string,
    fechaCita: string,
    horaCita: string,
    motivo?: string,
    nombreVeterinario?: string,
  ) => {
    let message = `Hola ${nombreDueno}! 🐾\n\n`;
    message += `Te recordamos que tienes una cita programada para *${nombreMascota}*.\n\n`;
    message += `📅 *Fecha:* ${fechaCita}\n`;
    message += `🕐 *Hora:* ${horaCita}\n`;

    if (motivo) {
      message += `📋 *Motivo:* ${motivo}\n`;
    }

    if (nombreVeterinario) {
      message += `👨‍⚕️ *Veterinario:* Dr(a). ${nombreVeterinario}\n`;
    }

    message += `\nTe esperamos en *PetCast Veterinaria*. Si necesitas reprogramar, contáctanos con anticipación.\n\n`;
    message += `¡Gracias por confiar en nosotros! 🏥`;

    return message;
  },

  // Recordatorio de vacunación
  vaccinationReminder: (
    nombreDueno: string,
    nombreMascota: string,
    nombreVacuna: string,
    fechaProgramada?: string,
    notas?: string,
  ) => {
    let message = `Hola ${nombreDueno}! 💉🐾\n\n`;
    message += `Es momento de la vacunación de *${nombreMascota}*.\n\n`;
    message += `💊 *Vacuna:* ${nombreVacuna}\n`;

    if (fechaProgramada) {
      message += `📅 *Fecha sugerida:* ${fechaProgramada}\n`;
    }

    if (notas) {
      message += `📝 *Notas:* ${notas}\n`;
    }

    message += `\nLas vacunas son fundamentales para proteger la salud de tu mascota. `;
    message += `Te invitamos a agendar una cita lo antes posible.\n\n`;
    message += `📞 Contáctanos para programar la cita.\n\n`;
    message += `*PetCast Veterinaria* - Cuidamos de tu mejor amigo 🏥`;

    return message;
  },

  // Recordatorio de revisión general
  checkupReminder: (
    nombreDueno: string,
    nombreMascota: string,
    tipoRevision?: string,
  ) => {
    let message = `Hola ${nombreDueno}! 🐾\n\n`;
    message += `Es tiempo de la revisión ${tipoRevision || 'periódica'} de *${nombreMascota}*.\n\n`;
    message += `Las revisiones regulares ayudan a mantener a tu mascota saludable y detectar cualquier problema a tiempo.\n\n`;
    message += `📞 Agenda tu cita hoy mismo.\n\n`;
    message += `*PetCast Veterinaria* - Tu mascota en las mejores manos 🏥`;

    return message;
  },

  // Confirmación de cita
  appointmentConfirmation: (
    nombreDueno: string,
    nombreMascota: string,
    fechaCita: string,
    horaCita: string,
  ) => {
    let message = `Hola ${nombreDueno}! ✅\n\n`;
    message += `Tu cita para *${nombreMascota}* ha sido confirmada.\n\n`;
    message += `📅 *Fecha:* ${fechaCita}\n`;
    message += `🕐 *Hora:* ${horaCita}\n\n`;
    message += `Te esperamos en *PetCast Veterinaria*.\n\n`;
    message += `¡Gracias por tu confianza! 🐾`;

    return message;
  },

  // Cancelación de cita
  appointmentCancellation: (
    nombreDueno: string,
    nombreMascota: string,
    fechaCita: string,
  ) => {
    let message = `Hola ${nombreDueno}.\n\n`;
    message += `Te informamos que la cita de *${nombreMascota}* programada para el ${fechaCita} ha sido cancelada.\n\n`;
    message += `Si deseas reprogramar, no dudes en contactarnos.\n\n`;
    message += `*PetCast Veterinaria* 🏥`;

    return message;
  },

  // Post-consulta / Seguimiento
  followUp: (
    nombreDueno: string,
    nombreMascota: string,
    indicaciones?: string,
  ) => {
    let message = `Hola ${nombreDueno}! 🐾\n\n`;
    message += `Gracias por visitar *PetCast Veterinaria* con ${nombreMascota}.\n\n`;

    if (indicaciones) {
      message += `📋 *Indicaciones de seguimiento:*\n${indicaciones}\n\n`;
    }

    message += `Si tienes alguna duda o notas cambios en el comportamiento de tu mascota, no dudes en contactarnos.\n\n`;
    message += `¡Estamos aquí para ayudarte! 💚`;

    return message;
  },

  // Mensaje genérico personalizado
  customMessage: (
    nombreDueno: string,
    mensaje: string,
  ) => {
    return `Hola ${nombreDueno}!\n\n${mensaje}\n\n*PetCast Veterinaria* 🐾`;
  },

  // Código de recuperación de contraseña
  passwordRecoveryCode: (
    nombreUsuario: string,
    codigo: string,
  ) => {
    let message = `Hola ${nombreUsuario}! 🔐\n\n`;
    message += `Has solicitado recuperar tu contraseña en *PetCast*.\n\n`;
    message += `Tu código de verificación es:\n\n`;
    message += `*${codigo}*\n\n`;
    message += `⏰ Este código expira en *10 minutos*.\n\n`;
    message += `Si no solicitaste este código, ignora este mensaje.\n\n`;
    message += `*PetCast Veterinaria* 🐾`;

    return message;
  },
};

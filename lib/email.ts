import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPinEmail(
  email: string,
  nombre: string,
  pin: string,
  plazaNombre: string
): Promise<boolean> {
  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'TurEmpleo <onboarding@resend.dev>',
      to: email,
      subject: 'Su solicitud ha sido recibida - TurEmpleo',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #002A8F 0%, #0044CC 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">¡Solicitud Recibida!</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">TurEmpleo - Portal de Empleo Turístico</p>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none;">
            <p style="font-size: 16px; color: #333;">Hola <strong>${nombre}</strong>,</p>
            
            <p style="font-size: 16px; color: #333;">
              Hemos recibido exitosamente su solicitud para la plaza de:
            </p>
            
            <div style="background: #f8f9fa; border-left: 4px solid #002A8F; padding: 15px; margin: 20px 0;">
              <strong style="color: #002A8F; font-size: 18px;">${plazaNombre}</strong>
            </div>
            
            <div style="background: linear-gradient(135deg, #f0f4ff 0%, #e8eeff 100%); border: 2px solid #002A8F; border-radius: 10px; padding: 25px; text-align: center; margin: 25px 0;">
              <p style="color: #666; font-size: 14px; margin: 0 0 10px 0;">Su PIN de seguimiento:</p>
              <p style="font-size: 42px; font-weight: bold; color: #002A8F; letter-spacing: 6px; margin: 0;">${pin}</p>
              <p style="color: #888; font-size: 12px; margin: 15px 0 0 0;">Guarde este PIN para consultar el estado de su solicitud</p>
            </div>
            
            <div style="background: #fff9e6; border: 1px solid #ffcc00; border-radius: 8px; padding: 20px; margin: 25px 0;">
              <p style="font-size: 16px; color: #333; margin: 0 0 10px 0;">
                <strong>¿Cómo consultar su estado?</strong>
              </p>
              <ol style="margin: 0; padding-left: 20px; color: #555;">
                <li style="margin-bottom: 8px;">Visite nuestro portal de consulta</li>
                <li style="margin-bottom: 8px;">Ingrese su Carné de Identidad (CI)</li>
                <li style="margin-bottom: 8px;">Ingrese su PIN de seguimiento</li>
              </ol>
              <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/estado" 
                 style="display: inline-block; background: #002A8F; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; margin-top: 15px; font-weight: bold;">
                Consultar Estado
              </a>
            </div>
            
            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              Si no realizó esta solicitud, puede ignorar este correo.
            </p>
          </div>
          
          <div style="background: #f5f5f5; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0; border-top: none;">
            <p style="color: #888; font-size: 12px; margin: 0;">
              © ${new Date().getFullYear()} TurEmpleo - Todos los derechos reservados
            </p>
          </div>
        </div>
      `
    });
    return true;
  } catch (error) {
    console.error('Error enviando email:', error);
    return false;
  }
}

export async function sendCitaEmail(
  email: string,
  nombre: string,
  plazaNombre: string,
  fechaCita: string,
  requisitos: string,
  direccion: string
): Promise<boolean> {
  try {
    const fechaFormateada = new Date(fechaCita).toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'TurEmpleo <onboarding@resend.dev>',
      to: email,
      subject: `Cita de Entrevista - ${plazaNombre} - TurEmpleo`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #002A8F 0%, #0044CC 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">¡Tiene una Cita de Entrevista!</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">TurEmpleo - Portal de Empleo Turístico</p>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none;">
            <p style="font-size: 16px; color: #333;">Hola <strong>${nombre}</strong>,</p>
            
            <p style="font-size: 16px; color: #333;">
              Le informamos que ha sido citado para una entrevista de trabajo. Los detalles son los siguientes:
            </p>
            
            <div style="background: #f8f9fa; border-left: 4px solid #002A8F; padding: 15px; margin: 20px 0;">
              <p style="margin: 0 0 10px 0;"><strong style="color: #002A8F;">Plaza:</strong> <span style="font-size: 18px;">${plazaNombre}</span></p>
              <p style="margin: 0;"><strong style="color: #002A8F;">Fecha:</strong> ${fechaFormateada}</p>
            </div>
            
            <div style="background: #fff3cd; border: 1px solid #ffc107; border-radius: 8px; padding: 20px; margin: 25px 0;">
              <p style="font-size: 16px; color: #333; margin: 0 0 10px 0;">
                <strong>📍 Dirección:</strong>
              </p>
              <p style="font-size: 16px; color: #333; margin: 0; font-weight: 500;">
                ${direccion}
              </p>
            </div>
            
            <div style="background: #d1ecf1; border: 1px solid #17a2b8; border-radius: 8px; padding: 20px; margin: 25px 0;">
              <p style="font-size: 16px; color: #333; margin: 0 0 10px 0;">
                <strong>📋 Documentos y Requisitos a Traer:</strong>
              </p>
              <p style="font-size: 15px; color: #333; margin: 0; white-space: pre-line;">${requisitos}</p>
            </div>
            
            <div style="background: #d4edda; border: 1px solid #28a745; border-radius: 8px; padding: 20px; margin: 25px 0; text-align: center;">
              <p style="font-size: 16px; color: #155724; margin: 0;">
                <strong>⚠️ Importante:</strong> Por favor, arrive con 15 minutos de anticipación.
              </p>
            </div>
            
            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              Si no puede asistir a la cita, por favor comuníquese con nosotros para reagendar.
            </p>
          </div>
          
          <div style="background: #f5f5f5; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0; border-top: none;">
            <p style="color: #888; font-size: 12px; margin: 0;">
              © ${new Date().getFullYear()} TurEmpleo - Todos los derechos reservados
            </p>
          </div>
        </div>
      `
    });
    return true;
  } catch (error) {
    console.error('Error enviando email de cita:', error);
    return false;
  }
}

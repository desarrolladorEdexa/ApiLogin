import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './services/api.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  cedula: string = '';
  usuarioEncontrado: boolean = false;
  datosUsuario: any = {};
  mostrarFormulario: boolean = false;
  fotoPreview: string | ArrayBuffer | null = null;
  fotoArchivo: File | null = null;
  ciudad: string = '';
  otraCiudad: string = '';
  mensajeError: string = '';
  flip: boolean = false;

  constructor(private apiService: ApiService, private sanitizer: DomSanitizer) {}

  validarCedula() {
    if (!/^\d{6,10}$/.test(this.cedula)) {
      this.mensajeError = 'Cédula inválida. Debe contener entre 6 y 10 dígitos.';
      return;
    }

    this.apiService.validarCedula(this.cedula).subscribe(
      (respuesta) => {
        if (respuesta && respuesta.nombre) {
          this.usuarioEncontrado = true;
          this.datosUsuario = respuesta;
          this.mensajeError = '';
        } else {
          this.usuarioEncontrado = false;
          this.mostrarFormulario = true;
          this.mensajeError = 'No estás registrado.';
          this.flip = true;
        }
      },
      (error) => {
        this.mensajeError = 'Error al validar la cédula.';
        console.error(error);
      }
    );
  }

  onFotoSeleccionada(event: any) {
    const archivo = event.target.files[0];
    if (archivo) {
      this.fotoArchivo = archivo;
      const lector = new FileReader();
      lector.onload = e => this.fotoPreview = lector.result;
      lector.readAsDataURL(archivo);
    }
  }

  registrar() {
    if (!/^\d{10}$/.test(this.datosUsuario.telefono)) {
      this.mensajeError = 'Teléfono inválido. Debe contener 10 dígitos.';
      return;
    }

    if (!this.fotoArchivo) {
      this.mensajeError = 'La foto es obligatoria.';
      return;
    }

    const ciudadSeleccionada = this.ciudad === 'Otro' ? this.otraCiudad : this.ciudad;

    const formData = new FormData();
    formData.append('cedula', this.cedula);
    formData.append('nombre', this.datosUsuario.nombre);
    formData.append('telefono', this.datosUsuario.telefono);
    formData.append('ciudad', ciudadSeleccionada);
    formData.append('foto', this.fotoArchivo);

    this.apiService.registrarUsuario(formData).subscribe(
      (respuesta) => {
        this.mensajeError = '';
        this.enviarWhatsApp();
      },
      (error) => {
        this.mensajeError = 'Error al registrar el usuario.';
        console.error(error);
      }
    );
  }

  enviarWhatsApp() {
    const mensaje = encodeURIComponent(`Hola, me he registrado con éxito. Cédula: ${this.cedula} Telefono: ${this.datosUsuario.telefono}`);
    const url = `https://wa.me/573217563410?text=${mensaje}`;
    window.open(url, '_blank');
  }
}

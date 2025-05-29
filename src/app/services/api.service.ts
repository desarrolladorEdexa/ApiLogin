import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {


  private apiUrl = '/api/api_backend_ai/dinamic-db/report/119/assesmentDEV';
  private token = '790cfdfb568c8ca697c72f52d8fab5af63ede025';

  constructor(private http: HttpClient) {}

  validarCedula(cedula: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Token ${this.token}`
    });
    return this.http.get(`${this.apiUrl}?cedula=${cedula}`, { headers });
  }

  registrarUsuario(datos: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Token ${this.token}`,
      'Content-Type': 'application/json'
    });
    return this.http.post(this.apiUrl, datos, { headers });
  }

  
}

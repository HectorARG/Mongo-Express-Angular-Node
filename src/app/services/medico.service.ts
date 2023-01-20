import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Medico } from '../models/medico.model';
import { Hospital } from '../models/hospital.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  constructor(private http: HttpClient) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  obtenerMedicos(){
    const url = `${ base_url }/medicos`
    return this.http.get( url, this.headers ).pipe(map( (resp: { ok: boolean, medicos: Medico[] }) => resp.medicos));
  }

  crearMedico( medico: { nombre: string, hospital: string }){
    const url = `${ base_url }/medicos`
    return this.http.post<Medico>( url, medico  , this.headers );
  }

  actualizarMedico( medico: Medico ){
    const url = `${ base_url }/medicos/${ medico._id }`;
    return this.http.put<Medico>( url, medico  , this.headers );
  }

  eliminarMedico( id: string ){
    const url = `${ base_url }/medicos/${ id }`
    return this.http.delete<Medico>( url , this.headers );
  }

  obtenerMedicosById(id: string){
    const url = `${ base_url }/medicos/${ id }`;
    return this.http.get( url , this.headers ).pipe(map( (resp: { ok: boolean, medico: Medico }) => resp.medico));
  }
}

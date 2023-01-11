import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CargarHospital } from '../interfaces/cargar-hospitales.interface';
import { map, tap } from 'rxjs/operators';
import { Hospital } from '../models/hospital.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  constructor(
    private http: HttpClient,
  ) { }

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

  obtenerHospitales(){
    const url = `${ base_url }/hospitales`
    return this.http.get( url, this.headers )
      .pipe(map( (res: { ok: boolean, hospitales: Hospital[] }) => res.hospitales ));
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

import { Usuario } from '../models/usuario.model';
import { Hospital } from '../models/hospital.model';

const base_url = environment.base_url;


@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

  constructor( private http: HttpClient ) { }

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

  private transformarUsuarios( resultados: any[] ): Usuario[] {
    return resultados.map(
      user => new Usuario(user.nombre, user.email, '', user.img, user.google, user.role, user.uid )
    );
  }

  private transformarHospitales( resultados: any[] ): Hospital[] {
    return resultados.map(
      hospital => new Hospital(hospital.nombre, hospital._id, hospital.img, hospital.usuario )
    );
  }

  buscar(
      tipo: 'usuarios'|'medicos'|'hospitales',
      termino: string
    ) {

    const url = `${ base_url }/todo/coleccion/${ tipo }/${ termino }`;
    return this.http.get<any[]>( url, this.headers )
            .pipe(
              map( (resp: any ) => {

                if(tipo === 'usuarios'){
                  return this.transformarUsuarios( resp.resultados );
                } else if(tipo === 'hospitales'){
                  return this.transformarHospitales( resp.resultados );
                }else{
                  return [];
                }

              })
            );

  }


}

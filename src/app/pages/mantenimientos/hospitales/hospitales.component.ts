import { Component, OnInit, OnDestroy } from '@angular/core';

import Swal from 'sweetalert2';

import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { HospitalService } from './../../../services/hospital.service';
import { Hospital } from '../../../models/hospital.model';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { BusquedasService } from '../../../services/busquedas.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit, OnDestroy {

  public hospitales : Hospital[] = [];
  public hospitalesTemp: Hospital[] = [];
  public cargando: boolean = true;

  public imgSubs: Subscription;

  constructor( private hospitalService: HospitalService,
               private modalImagenService: ModalImagenService,
               private busquedasService: BusquedasService, ) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarHospital();

    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(delay(100))
      .subscribe( img => this.cargarHospital() );
  }

  cargarHospital(){
    this.cargando = true;
    this.hospitalService.obtenerHospitales().subscribe(hospitales => {
      this.hospitales = hospitales;
      this.hospitalesTemp = hospitales;
      this.cargando = false;
    })
  }

  guardarCambio( hospital: Hospital ){
    Swal.fire({
      title: 'Actualizar hospital',
      text: `¿Desea actualizar este hospital?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, actualizar'
    }).then(() => {
      this.hospitalService.actualizarHospitales(hospital._id, hospital.nombre).subscribe(resp => {
        Swal.fire(
          'Hospital actualizado',
          ``,
          'success'
        );
      }, err => {
        Swal.fire(
          'Error inesperado',
          `Error al actualizar hospital ${ hospital.nombre }`,
          'error'
        );
      });
    })
  }

  eliminarHospital( hospital: Hospital ){
    Swal.fire({
      title: 'Eliminar hospital',
      text: `¿Desea eliminar ${hospital.nombre}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar'
    }).then(() => {
      this.hospitalService.eliminarHospitales(hospital._id).subscribe(resp => {
        Swal.fire(
          'Hospital Eliminado',
          `Hospital ${hospital.nombre} eliminado`,
          'success'
        ).finally(() => {
          this.cargarHospital()
        });
      }, err => {
        Swal.fire(
          'Error inesperado',
          `Error al actualizar hospital ${ hospital.nombre }`,
          'error'
        );
      });
    })
  }

  async abrirSwertAlert(){
    const { value = '' } = await Swal.fire<string>({
      title: 'Agregar hoapital',
      text:'Ingrese el nombre del nuevo hospital',
      input: 'text',
      inputPlaceholder: 'Nombre del hospital',
      showCancelButton: true
    })
    if(value.trim().length > 0 ){
      this.hospitalService.crearHospitales(value).subscribe(res =>{
        this.cargarHospital()
      },err => {
        console.log(err)
      });
    }

  }

  abrirModal( hospital: Hospital ) {

    this.modalImagenService.abrirModal('hospitales', hospital._id, hospital.img );
  }

  busquedaHospital( termino: string ){

    if ( termino.length === 0 ) {
      return this.hospitales = this.hospitalesTemp;
    }

    this.busquedasService.buscar( 'hospitales', termino )
        .subscribe( resp => {

          this.hospitales = resp;

        });
  }
}

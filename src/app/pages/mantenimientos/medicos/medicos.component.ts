import { Component, OnInit, OnDestroy } from '@angular/core';

import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';

import { BusquedasService } from '../../../services/busquedas.service';
import { Medico } from '../../../models/medico.model';
import { MedicoService } from '../../../services/medico.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {

  public medicos: Medico[] = [];
  public cargando: boolean = true;

  public imgSubs: Subscription;

  constructor( private medicoService: MedicoService,
               private modalImagenService: ModalImagenService,
               private busquedasService: BusquedasService ) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarMedicos();

    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(delay(100))
      .subscribe( img => this.cargarMedicos() );
  }

  cargarMedicos(){
    this.cargando = true;
    this.medicoService.obtenerMedicos().subscribe(resp => {
      this.medicos = resp
      this.cargando = false;
    });
  }

  abrirModal( medico: Medico ) {
    this.modalImagenService.abrirModal('medicos', medico._id, medico.img );
  }

  busquedaMedico( termino: string ){

    if ( termino.length === 0 ) {
      this.cargarMedicos();
    }

    this.busquedasService.buscar( 'medicos', termino ).subscribe( (resp: Medico[]) => { this.medicos = resp });
  }

  eliminarMedico( medico: Medico ){
    Swal.fire({
      title: 'Eliminar medico',
      text: `¿Desea eliminar ${medico.nombre}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar'
    }).then(() => {
      this.medicoService.eliminarMedico(medico._id).subscribe(resp => {
        Swal.fire(
          'medico Eliminado',
          `medico ${medico.nombre} eliminado`,
          'success'
        ).finally(() => {
          this.cargarMedicos()
        });
      }, err => {
        Swal.fire(
          'Error inesperado',
          `Error al eliminar medico ${ medico.nombre }`,
          'error'
        );
      });
    })
  }

}

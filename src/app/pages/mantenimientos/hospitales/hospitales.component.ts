import { HospitalService } from './../../../services/hospital.service';
import { Component, OnInit } from '@angular/core';
import { Hospital } from '../../../models/hospital.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit {

  public hospitales : Hospital[] = [];
  public cargando: boolean = true;

  constructor( private hospitalService: HospitalService ) { }

  ngOnInit(): void {
    this.cargarHospital();
  }

  cargarHospital(){
    this.cargando = true;
    this.hospitalService.obtenerHospitales().subscribe(hospitales => {
      this.hospitales = hospitales;
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
    const {value} = await Swal.fire<string>({
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
}

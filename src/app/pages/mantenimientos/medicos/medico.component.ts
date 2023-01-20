import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';

import Swal from 'sweetalert2';

import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from '../../../models/medico.model';

import { HospitalService } from '../../../services/hospital.service';
import { MedicoService } from '../../../services/medico.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit {

  public medicoForm: FormGroup;
  public hospitales: Hospital[] = [];
  public hospitalSeleccionado: Hospital;
  public medicoSeleccionado: Medico;
  public existeHospitalSeleccionado: boolean = false;

  private imgSubs: Subscription;

  constructor( private fb: FormBuilder,
               private hospitalService: HospitalService,
               private medicoService: MedicoService,
               private router: Router,
               private activatedRoute: ActivatedRoute,
               private modalImagenService: ModalImagenService) { }

  ngOnInit(): void {

    this.paramsPages();

    this.medicoForm = this.fb.group({
      nombre: [null, Validators.required],
      hospital: [null, Validators.required],
    });

    this.cargarHospitales();
    this.medicoSeleccionadoF();

    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(delay(100))
      .subscribe( img => this.paramsPages() );
  }

  paramsPages(){
    this.activatedRoute.params.subscribe( ({ id }) => this.obtenerMedicoPorId(id));
  }

  medicoSeleccionadoF(){
    this.medicoForm.get('hospital').valueChanges.subscribe( hospitalId  => {
      this.hospitalSeleccionado = this.hospitales.find( h => h._id === hospitalId );
      if(this.hospitalSeleccionado !== undefined) {
        this.existeHospitalSeleccionado = true
      }else{
        this.existeHospitalSeleccionado = false;
      }
    });
  }

  cargarHospitales(){
    this.hospitalService.obtenerHospitales().subscribe((hospitales: Hospital[]) => {
      this.hospitales = hospitales;
    })
  }

  guardarMedico(){

    if(this.medicoSeleccionado){
      // Actualizar
      const data: Medico = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id
      }
      this.medicoService.actualizarMedico(data).subscribe(() => {
        Swal.fire('Medico actualizado', ``,'success').then(() => this.router.navigateByUrl('/dashboard/medicos'));
      });
    }else{
      //Crear
      this.medicoService.crearMedico(this.medicoForm.value).subscribe(() => {
        Swal.fire('Medico creado', ``,'success').then(() => this.router.navigateByUrl('/dashboard/medicos'));
      });
    }
  }

  obtenerMedicoPorId(id: string){

    if(id === 'nuevo'){ return };

    this.medicoService.obtenerMedicosById(id).subscribe(medico => {

      if(!medico){
        return this.router.navigateByUrl('/dashboard/medicos');
      };

      const { nombre, hospital:{ _id } } = medico;
      this.medicoForm.setValue({ nombre, hospital: _id });
      this.medicoSeleccionado = medico;
    });
  }

  abrirModal( medico: Medico ) {
    this.modalImagenService.abrirModal('medicos', medico._id, medico.img );
  }

}

import { HospitalService } from './../../../services/hospital.service';
import { Component, OnInit } from '@angular/core';
import { Hospital } from '../../../models/hospital.model';

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

}

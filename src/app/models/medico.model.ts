
interface _MedicoUser{
  _id: string;
  nombre: string;
  img: string;
}

interface _HospitalMedico{
  _id: string;
  nombre: string;
  img: string;
}


export class Medico {

  constructor(
    public nombre: string,
    public _id?: string,
    public img?: string,
    public usuario?: _MedicoUser,
    public hospital?: _HospitalMedico
  ){}

}

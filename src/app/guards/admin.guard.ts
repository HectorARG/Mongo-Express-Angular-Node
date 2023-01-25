import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor( private usuario: UsuarioService,
               private router: Router){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {

      if (this.usuario.role === 'ADMIN_ROLE') {
        return true;
      } else {
        this.router.navigateByUrl('/')
        return false;
      }

      // return (this.usuario.role === 'ADMIN_ROLE') ? true : false;
  }

}

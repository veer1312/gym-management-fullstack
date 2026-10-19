import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../../user/header/header';
import { UserSidebar } from '../../user/user-sidebar/user-sidebar';
import { Footer } from '../../user/footer/footer';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet,Header,Footer,UserSidebar],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {

   isMobileOpen = false;


  toggleMobileSidebar(): void {

    this.isMobileOpen = !this.isMobileOpen;

  }


  closeMobileSidebar(): void {

    this.isMobileOpen = false;

  }

}

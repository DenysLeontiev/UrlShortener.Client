import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../_services/auth-service/auth-service';
import { COMMON_IMPORTS } from '../../shared-imports';
import { AboutPageService } from '../../_services/about-page/about-page-service';
import { AboutPage } from '../../_models/aboutPage';
import { EditAboutPage } from '../../_models/editAboutPage';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-about-algorithm',
  imports: [COMMON_IMPORTS],
  templateUrl: './about-algorithm.html',
  styleUrl: './about-algorithm.scss'
})
export class AboutAlgorithm implements OnInit {

  public authService: AuthService = inject(AuthService);
  public aboutPageService: AboutPageService = inject(AboutPageService);

  private toastr: ToastrService = inject(ToastrService)

  public aboutPage: AboutPage = {} as AboutPage;
  public editAboutPage: EditAboutPage = {} as EditAboutPage;

  public isEditing: boolean = false;

  ngOnInit(): void {
    this.loadAboutPage();
  }

  public startEditing(): void {
    this.isEditing = true;
  }

  public cancelEditing(): void {
    this.isEditing = false;
  }

  public saveAboutContent(): void {
    this.isEditing = false;
    this.editAboutPage.newContent = this.aboutPage.content;

    this.aboutPageService.editAboutPage(this.editAboutPage).subscribe((response) => {
      this.toastr.success("Content has been edited");

      this.editAboutPage = {} as EditAboutPage;
    }, (error) => {
      this.toastr.error(error.error);
    })
  }

  public loadAboutPage(): void {
    this.aboutPageService.getAboutPage().subscribe((response) => {
      this.aboutPage = response;
      console.log(response);

    }, (error) => {
      console.log(error);
    });
  }
}

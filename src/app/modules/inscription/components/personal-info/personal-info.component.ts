/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import { Country } from '../../interfaces/country';
import { StatesService } from '../../services/states.service';
import { ColombianStatesAndCities } from '../../interfaces/colombian-states';
import { ApplicantService } from 'src/app/modules/auth/services/applicant.service';
import swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class PersonalInfoComponent implements OnInit{
  public value: string = '';
  public selectedIndex: number = 0;
  public maxNumberOfTabs: number = 3;
  public mainForm: FormGroup;
  public maxDate: Date;

  public countries: Country[] = [];
  public selectedCountry: Country = {} as Country;
  public states: ColombianStatesAndCities[] = [];
  public towns!: any;
  public foreignCountry: boolean = false;
  public foreignCountry2: boolean = false;
  public isForeign: boolean = false;
  public isDropdownFocused = false;

  public finishInscriptionTrigger = false;

  public genders: any[] = [
    { name: 'Hombre', key: 'M' },
    { name: 'Mujer', key: 'F' },
    //{ name: 'Otro', key: 'O' },
  ];

  public tabs = [true, false, false];

  constructor(
    private _fb: FormBuilder,
    private _ctr: CountriesService,
    private _clmbnSts: StatesService,
    private _applicant: ApplicantService,
    private _datePipe: DatePipe,
    private spinner: NgxSpinnerService,
    private auth: AuthService,
    private router: Router
  ) {
    this.maxDate = new Date();

    this.mainForm = this._fb.group({
      name: ['', Validators.required],
      familyName: ['', Validators.required],
      id: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      idExpeditionDate: ['', Validators.required],
      birthDate: ['', Validators.required],
      countryOfBirth: ['Colombia', Validators.required],
      gender: ['', Validators.required],
      residenceState: [''],
      residenceTown: [''],
      residenceDirection: ['', Validators.required],
      telephoneNumber: [ '', [ Validators.required, Validators.maxLength(10), Validators.pattern(/^\d{10}$/) ],],
      workingEntity: ['', Validators.required],
      workingCountry: ['Colombia', Validators.required],
      workingState: ['', Validators.required],
      workingTown: [''],
      workingDirection: ['', Validators.required],
      undergraduateStudies: ['', Validators.required],
      graduatedFromUFPS: ['', Validators.required],
      postgraduateStudies: [''],
      workingExperience: ['', Validators.required],
    });

    this._ctr.getCountry().subscribe((countries) => {
      this.countries = countries;
    });

    this._clmbnSts.getState().subscribe((states) => {
      this.states = states
        .map((state) => ({
          id: 0,
          departamento: state.departamento,
          ciudades: [state.municipio],
        }))
        .filter(
          (value, index, self) =>
            self.findIndex((s) => s.departamento === value.departamento) ===
            index
        );
    });

  }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') ?? '{}')
    const oldFormValue = JSON.parse(localStorage.getItem('userInfo') ?? '{}')
  
    if(user && (user.status >= 2 && user.status < 7) )
      this.router.navigate([this.navigateByStatus(user.status)])

    this.mainForm.setValue(oldFormValue);
    this.setDateFromLocal(oldFormValue.birthDate, oldFormValue.idExpeditionDate)
    this.checkStranger();
    this.checkStranger2();
  }

  /**
   * Método para comprobar si la información guardada en el  localstorage referente al pais,
   * corresponde a alguien extranjero.
   * Estable el pais. departamento y municipio seleccionados si se hizo.
   */
  private checkStranger(){
    if(`${this.mainForm.controls['countryOfBirth'].value}`.toLocaleLowerCase() !== 'colombia')
      this.onForeignCountryChange(`${this.mainForm.controls['countryOfBirth'].value}`);
    this.setMunicipio(`${this.mainForm.controls['residenceState'].value}`)
  }

  /**
   * Método para comprobar si la información guardada en el  localstorage referente al pais,
   * corresponde a alguien extranjero.
   * Estable el pais. departamento y municipio seleccionados si se hizo.
   */
  private checkStranger2(){
    if(`${this.mainForm.controls['workingCountry'].value}`.toLocaleLowerCase() !== 'colombia')
      this.onForeignCountryChange2(`${this.mainForm.controls['workingCountry'].value}`);
    this.setMunicipio2(`${this.mainForm.controls['workingState'].value}`)
  }

  /**
   * Método para establecer las fechas en los p-calendar cuando se almacena la información en el
   * localstorage si se hizo.
   */
  private setDateFromLocal(birdDate: string, idDate: string){

    if( birdDate.length > 0  && birdDate != null ){
      this.mainForm.controls['birthDate'].setValue(new Date(`${this.mainForm.controls['birthDate'].value}`))
    }

    if(idDate.length > 0 && (this.mainForm.controls['idExpeditionDate'].value != null) ){
      this.mainForm.controls['idExpeditionDate'].setValue(new Date(`${this.mainForm.controls['idExpeditionDate'].value}`))
    }
  }

  private checkValidDate(date: Date){
    return date instanceof Date && !isNaN(date.getTime())
  }

  /**
   * Método para establecer los municipios dado un departamento.
   * @param selectedState Departamento seleccionado
   */
  public setMunicipio(selectedState: string) {
    this._clmbnSts.getTowns().subscribe((states) => {
      const matchingState = states.find(
        (state) => state.departamento === selectedState
      );
      if (matchingState) {
        this.towns = matchingState.ciudades.map((city) => ({ name: city }));
      }
    });
  }
  
  /**
   * Método para establecer los municipios dado un departamento.
   * @param selectedState Departamento seleccionado
   */
  public setMunicipio2(selectedState: string) {
    this._clmbnSts.getTowns().subscribe((states) => {
      const matchingState = states.find(
        (state) => state.departamento === selectedState
      );
      if (matchingState) {
        this.towns = matchingState.ciudades.map((city) => ({ name: city }));
      }
    });
  }

  /**
   * Método para establecer si un aspirante es extranjero
   * @param selectedCountry Pais seleccionado
   */
  public onForeignCountryChange(selectedCountry: string) {
    this.foreignCountry = selectedCountry !== 'Colombia';
    this.mainForm.get('residenceState')?.setValue('Extranjero');
    this.mainForm.get('residenceTown')?.setValue('Extranjero');
    this.isForeign = true;
  }

  /**
   * Método para establecer si un aspirante es extranjero
   * @param selectedCountry Pais seleccionado
   */
  public onForeignCountryChange2(selectedCountry: string) {
    this.foreignCountry2 = selectedCountry !== 'Colombia';
    this.mainForm.get('workingState')?.setValue('Extranjero');
    this.mainForm.get('workingTown')?.setValue('Extranjero');
    this.isForeign = true;
  }

  /**
   * Método para registrar un aspirante cuando todo este ok
   */
  public registerApplicant() {
    const name = this.mainForm.get('name')?.value;
    const familyName = this.mainForm.get('familyName')?.value;
    const id = this.mainForm.get('id')?.value;
    const idExpeditionDate = this._datePipe.transform(
      this.mainForm.get('idExpeditionDate')?.value,
      'YYYY-MM-dd'
    ) as unknown as Date;
    const birthDate = this._datePipe.transform(
      this.mainForm.get('birthDate')?.value,
      'YYYY-MM-dd'
    ) as unknown as Date;
    const countryOfBirth = this.mainForm.get('countryOfBirth')?.value;
    const gender = this.mainForm.get('gender')?.value.name;
    const residenceState = this.mainForm.get('residenceState')?.value;
    const residenceTown = this.mainForm.get('residenceTown')?.value;
    const residenceDirection = this.mainForm.get('residenceDirection')?.value;
    const telephoneNumber = this.mainForm.get('telephoneNumber')?.value;
    const workingEntity = this.mainForm.get('workingEntity')?.value;
    const workingCountry = this.mainForm.get('workingCountry')?.value;
    const workingState = this.mainForm.get('workingState')?.value;
    const workingTown = this.mainForm.get('workingTown')?.value;
    const workingDirection = this.mainForm.get('workingDirection')?.value;
    const undergraduateStudies = this.mainForm.get(
      'undergraduateStudies'
    )?.value;
    const graduatedFromUFPS =
      this.mainForm.get('graduatedFromUFPS')?.value === 'yes' ? true : false;
    const postgraduateStudies = this.mainForm.get('postgraduateStudies')?.value;
    const workingExperience = this.mainForm.get('workingExperience')?.value;

    this.spinner.show();

    this._applicant
      .registerApplicant(
        name,
        familyName,
        gender,
        countryOfBirth,
        idExpeditionDate,
        birthDate,
        id,
        residenceState,
        workingState,
        residenceTown.name,
        residenceDirection,
        telephoneNumber,
        workingEntity,
        workingCountry,
        workingTown.name,
        workingDirection,
        undergraduateStudies,
        postgraduateStudies,
        workingExperience,
        graduatedFromUFPS
      )
      .subscribe({
        next: (res) => {
          this.spinner.hide();
          this.auth.changeStateCurrentUser();
          this.finishInscriptionTrigger = true
        },
        error: (err) => {
          this.spinner.hide();
          swal.fire(
            '¡Error!',
            'No has diligenciado todos los campos correctamente',
            'error'
          );
        },
      });
  }

  public changeTap(index: number) {
    this.tabs = this.tabs.map((tab, indexTab) => indexTab == index);
  }

  public getControl(control: string) {
    return this.mainForm.get(control);
  }

  public navigateByStatus(status: number){

    if( status == 1 )
      return '/inscription/aspirante/personal-info'

    if(status >=2 && status < 5)
      return '/inscription/aspirante/documents'
    
    if(status >=5 )
      return '/inscription/aspirante/status'

    return ''
  }
}

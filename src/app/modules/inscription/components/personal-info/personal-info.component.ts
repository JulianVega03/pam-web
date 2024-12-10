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
  isOtroSelected: boolean = false;
  isPersonaConDiscapacidad: boolean = false;
  public countries: Country[] = [];
  public selectedCountry: Country = {} as Country;
  public states: ColombianStatesAndCities[] = [];
  public towns!: any;
  public towns2!: any;
  public foreignCountry: boolean = false;
  public foreignCountry2: boolean = false;
  public isForeign: boolean = false;
  public isForeign2: boolean = false;
  public isDropdownFocused = false;

  public finishInscriptionTrigger = false;

  public genders: any[] = [
    { name: 'Hombre - Masculino', key: 'M' },
    { name: 'Mujer - Femenino', key: 'F' },
    //{ name: 'Otro', key: 'O' },
  ];

  public documentTypes: any[] = [
    { label: 'CC - Cédula de Ciudadanía Colombiana', value: 'CC' },
    { label: 'DE - Documento de Identidad Extranjera', value: 'DE' },
    { label: 'CE - Cédula de Extranjería', value: 'CE' },
    { label: 'PS - Pasaporte', value: 'PS' },
    { label: 'CA - Certificado Cabildo', value: 'CA' }
  ];

  public estadoCivilTypes: any[] = [
    { label: 'Soltero(a)', value: 'Soltero(a)' },
    { label: 'Casado(a)', value: 'Casado(a)' },
    { label: 'Divorciado(a)', value: 'Divorciado(a)' },
    { label: 'Viudo(a)', value: 'Viudo(a)' },
    { label: 'Unión Libre', value: 'Unión Libre' },
    { label: 'Religioso(a)', value: 'Religioso(a)' },
    { label: 'Separado(a)', value: 'Separado(a)' }
  ];

  public zonaResidenciaTypes: any[] = [
    { label: 'Rural', value: 'Rural' },
    { label: 'Urbana', value: 'Urbana' }
  ];

  public grupoEtnicoTypes: any[] = [
    { label: 'No informa', value: 'No informa' },
    { label: 'Pueblo Indígena', value: 'Pueblo Indígena' },
    { label: 'Comunidad Negra', value: 'Comunidad Negra' },
    { label: 'Pueblo Rrom  o Gitano', value: 'Pueblo Rrom  o Gitano' },
    { label: 'No pertenece', value: 'No pertenece' }
  ];

  public puebloIndigenaTypes: any[] = [
    { label: 'No aplica', value: 'No aplica' },
    { label: 'Achagua', value: 'Achagua' },
    { label: 'Amorúa', value: 'Amorúa' },
    { label: 'Andoque o andoke', value: 'Andoque o andoke' },
    { label: 'Arhuaco (ijka)', value: 'Arhuaco (ijka)' },
    { label: 'Awa (cuaiker)', value: 'Awa (cuaiker)' },
    { label: 'Barea', value: 'Barea' },
    { label: 'Barí (motilón)', value: 'Barí (motilón)' },
    { label: 'Betoye', value: 'Betoye' },
    { label: 'Bara', value: 'Bara' },
    { label: 'Cañamomo', value: 'Cañamomo' },
    { label: 'Carapana', value: 'Carapana' },
    { label: 'Carijona o karijona', value: 'Carijona o karijona' },
    { label: 'Chimila (ette e´neka)', value: 'Chimila (ette e´neka)' },
    { label: 'Chiricoa', value: 'Chiricoa' },
    { label: 'Cocama', value: 'Cocama' },
    { label: 'Coconuco', value: 'Coconuco' },
    { label: 'Coyaima-Natagaima', value: 'Coyaima-Natagaima' },
    { label: 'Pijaos', value: 'Pijaos' },
    { label: 'Cubeo o kubeo', value: 'Cubeo o kubeo' },
    { label: 'Cuiba o kuiba', value: 'Cuiba o kuiba' },
    { label: 'Curripaco o kurripaco', value: 'Curripaco o kurripaco' },
    { label: 'Desano', value: 'Desano' },
    { label: 'Dujos', value: 'Dujos' },
    { label: 'Embera catio o katío', value: 'Embera catio o katío' },
    { label: 'Embera chami', value: 'Embera chami' },
    { label: 'Eperara siapidara', value: 'Eperara siapidara' },
    { label: 'Guambiano', value: 'Guambiano' },
    { label: 'Guanaca', value: 'Guanaca' },
    { label: 'Guane', value: 'Guane' },
    { label: 'Guyabero', value: 'Guyabero' },
    { label: 'Hitnú', value: 'Hitnú' },
    { label: 'Hupdu', value: 'Hupdu' },
    { label: 'Inga', value: 'Inga' },
    { label: 'Juhup', value: 'Juhup' },
    { label: 'Kamsa o kamëntsá', value: 'Kamsa o kamëntsá' },
    { label: 'Kankuamo', value: 'Kankuamo' },
    { label: 'Kakua', value: 'Kakua' },
    { label: 'Kogui', value: 'Kogui' },
    { label: 'Koreguaje o coreguaje', value: 'Koreguaje o coreguaje' },
    { label: 'Letuama', value: 'Letuama' },
    { label: 'Macaguaje o makaguaje', value: 'Macaguaje o makaguaje' },
    { label: 'Nukak (makú)', value: 'Nukak (makú)' },
    { label: 'Macuna o makuna (sara)', value: 'Macuna o makuna (sara)' },
    { label: 'Masiguare', value: 'Masiguare' },
    { label: 'Matapí', value: 'Matapí' },
    { label: 'Miraña', value: 'Miraña' },
    { label: 'Mokaná', value: 'Mokaná' },
    { label: 'Muinane', value: 'Muinane' },
    { label: 'Muisca', value: 'Muisca' },
    { label: 'Nonuya', value: 'Nonuya' },
    { label: 'Ocaina', value: 'Ocaina' },
    { label: 'Nasa (paéz)', value: 'Nasa (paéz)' },
    { label: 'Pastos', value: 'Pastos' },
    { label: 'Piapoco (dzase)', value: 'Piapoco (dzase)' },
    { label: 'Piaroa', value: 'Piaroa' },
    { label: 'Piratapuyo', value: 'Piratapuyo' },
    { label: 'Pisamira', value: 'Pisamira' },
    { label: 'Puinave', value: 'Puinave' },
    { label: 'Sánha', value: 'Sánha' },
    { label: 'Sikuani', value: 'Sikuani' },
    { label: 'Siona', value: 'Siona' },
    { label: 'Siriano', value: 'Siriano' },
    { label: 'Siripu o tsiripu (mariposo)', value: 'Siripu o tsiripu (mariposo)' },
    { label: 'Taiwano (tajuano)', value: 'Taiwano (tajuano)' },
    { label: 'Tanimuka', value: 'Tanimuka' },
    { label: 'Tariano', value: 'Tariano' },
    { label: 'Tatuyo', value: 'Tatuyo' },
    { label: 'Tikuna', value: 'Tikuna' },
    { label: 'Tororó', value: 'Tororó' },
    { label: 'Tucano (desea) o tukano', value: 'Tucano (desea) o tukano' },
    { label: 'Tule (kuna)', value: 'Tule (kuna)' },
    { label: 'Tuyuka (dojkapuara)', value: 'Tuyuka (dojkapuara)' },
    { label: 'U´wa(tunebo)', value: 'U´wa(tunebo)' },
    { label: 'Wanano', value: 'Wanano' },
    { label: 'Wayuu', value: 'Wayuu' },
    { label: 'Witoto - huitoto', value: 'Witoto - huitoto' },
    { label: 'Wiwa (arzario)', value: 'Wiwa (arzario)' },
    { label: 'Waunan (wuanana)', value: 'Waunan (wuanana)' },
    { label: 'Yagua', value: 'Yagua' },
    { label: 'Yanacona', value: 'Yanacona' },
    { label: 'Yauna', value: 'Yauna' },
    { label: 'Yukuna', value: 'Yukuna' },
    { label: 'Yuko (yukpa)', value: 'Yuko (yukpa)' },
    { label: 'Yurí (carabayo)', value: 'Yurí (carabayo)' },
    { label: 'Yuruti', value: 'Yuruti' },
    { label: 'Zenú / senú', value: 'Zenú / senú' },
    { label: 'Quillacingas', value: 'Quillacingas' },
    { label: 'No informa', value: 'No informa' },
    { label: 'Otro', value: 'Otro' }
  ];

  public poseeDiscapacidadTypes: any[] = [
    { label: 'Sí', value: 'Si' },
    { label: 'No', value: 'No' },
    { label: 'No informa', value: 'No informa' }
  ];

  public discapacidadTypes: any[] = [
    { label: 'Discapacidad Sensorial - Sordera Profunda', value: 'Discapacidad Sensorial - Sordera Profunda' },
    { label: 'Discapacidad Sensorial - Hipoacusia', value: 'Discapacidad Sensorial - Hipoacusia' },
    { label: 'Discapacidad Sensorial - Ceguera', value: 'Discapacidad Sensorial - Ceguera' },
    { label: 'Discapacidad Sensorial - Baja Visión', value: 'Discapacidad Sensorial - Baja Visión' },
    { label: 'Discapacidad Sensorial - Sordoceguera', value: 'Discapacidad Sensorial - Sordoceguera' },
    { label: 'Discapacidad Intelectual', value: 'Discapacidad Intelectual' },
    { label: 'Discapacidad Psicosocial', value: 'Discapacidad Psicosocial' },
    { label: 'Discapacidad Múltiple', value: 'Discapacidad Múltiple' },
    { label: 'Discapacidad Física o motora', value: 'Discapacidad Física o motora' },
    { label: 'No Aplica', value: 'No Aplica' }
  ];

  public capacidadxcepcionalTypes: any[] = [
    { label: 'Talento Excepcional general', value: 'Talento Excepcional general' },
    { label: 'Talento Excepcional específica', value: 'Talento Excepcional específica' },
    { label: 'No Aplica', value: 'No Aplica' }
  ];
  
  public tipoVinculacionTypes: any[] = [
    { label: 'Estudiante Nuevo', value: 'Estudiante Nuevo' },
    { label: 'Transferencia Interna', value: 'Transferencia Interna' },
    { label: 'Transferencia Externa', value: 'Transferencia Externa' },
    { label: 'Transferencia entre Seccionales', value: 'Transferencia entre Seccionales' },
    { label: 'Doble Programa', value: 'Doble Programa' }
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
      residenceState: ['', Validators.required],
      residenceTown: ['', Validators.required],
      residenceDirection: ['', Validators.required],
      telephoneNumber: [ '', [ Validators.required, Validators.maxLength(10), Validators.pattern(/^\d{10}$/) ],],
      workingEntity: ['', Validators.required],
      tipoVinculacionTypes: ['', Validators.required],
      workingCountry: ['Colombia', Validators.required],
      workingState: ['', Validators.required],
      workingTown: ['', Validators.required],
      workingDirection: ['', Validators.required],
      undergraduateStudies: ['', Validators.required],
      graduatedFromUFPS: ['', Validators.required],
      postgraduateStudies: [''],
      promedioPregrado: ['', Validators.required],
      workingExperience: ['', Validators.required],
      documentType: ['', Validators.required],
      estadoCivilTypes: ['', Validators.required],
      zonaResidenciaTypes: ['', Validators.required],
      grupoEtnicoTypes: ['', Validators.required],
      puebloIndigenaTypes: ['', Validators.required],
      otroPueblo: [''],
      poseeDiscapacidadTypes: ['', Validators.required],
      discapacidadTypes: ['', Validators.required],
      capacidadxcepcionalTypes: ['', Validators.required]
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

  onPuebloIndigenaChange(event: any) {
    if (event.value === 'Otro') {
      this.isOtroSelected = true;
    } else {
      this.isOtroSelected = false;
    }
  }

  onPersonaDiscapacidadChange(event: any) {
    // Si se selecciona "Sí", habilitamos el segundo dropdown
    this.isPersonaConDiscapacidad = event.value === 'Si';
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
        this.towns2 = matchingState.ciudades.map((city) => ({ name: city }));
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
    this.isForeign2 = true;
  }

  /**
   * Método para registrar un aspirante cuando todo este ok
   */
  public registerApplicant() {
    const name = this.mainForm.get('name')?.value;
    const familyName = this.mainForm.get('familyName')?.value;
    const countryOfBirth = this.mainForm.get('countryOfBirth')?.value;
    const residenceState = this.mainForm.get('residenceState')?.value;
    const residenceTown = this.mainForm.get('residenceTown')?.value;
    const residenceDirection = this.mainForm.get('residenceDirection')?.value;
    const telephoneNumber = this.mainForm.get('telephoneNumber')?.value;
    const documentType = this.mainForm.get('documentType')?.value;
    const id = this.mainForm.get('id')?.value;
    const idExpeditionDate = this._datePipe.transform(
      this.mainForm.get('idExpeditionDate')?.value,
      'YYYY-MM-dd'
    ) as unknown as Date;
    const birthDate = this._datePipe.transform(
      this.mainForm.get('birthDate')?.value,
      'YYYY-MM-dd'
    ) as unknown as Date;
    const gender = this.mainForm.get('gender')?.value.name;
    const estadoCivilTypes = this.mainForm.get('estadoCivilTypes')?.value;
    const zonaResidenciaTypes = this.mainForm.get('zonaResidenciaTypes')?.value;
    const grupoEtnicoTypes = this.mainForm.get('grupoEtnicoTypes')?.value;
    const puebloIndigenaTypes = this.mainForm.get('puebloIndigenaTypes')?.value;
    const otroPueblo = this.mainForm.get('otroPueblo')?.value;
    const poseeDiscapacidadTypes = this.mainForm.get('poseeDiscapacidadTypes')?.value;
    const discapacidadTypes = this.mainForm.get('discapacidadTypes')?.value;
    const capacidadxcepcionalTypes = this.mainForm.get('capacidadxcepcionalTypes')?.value;

    
    const tipoVinculacionTypes = this.mainForm.get('tipoVinculacionTypes')?.value;
    const workingState = this.mainForm.get('workingState')?.value;
    const workingEntity = this.mainForm.get('workingEntity')?.value;
    const workingCountry = this.mainForm.get('workingCountry')?.value;
    const workingTown = this.mainForm.get('workingTown')?.value;
    const workingDirection = this.mainForm.get('workingDirection')?.value;
    
    const undergraduateStudies = this.mainForm.get(
      'undergraduateStudies'
    )?.value;
    const graduatedFromUFPS =
      this.mainForm.get('graduatedFromUFPS')?.value === 'yes' ? true : false;
    const postgraduateStudies = this.mainForm.get('postgraduateStudies')?.value;
    const promedioPregrado = this.mainForm.get('promedioPregrado')?.value;
    const workingExperience = this.mainForm.get('workingExperience')?.value;

    this.spinner.show();

    this._applicant
      .registerApplicant(
        name,
        familyName,
        countryOfBirth,
        residenceState,
        residenceTown.name,
        residenceDirection,
        telephoneNumber,
        documentType,
        id,
        idExpeditionDate,
        birthDate,
        gender,
        estadoCivilTypes,
        zonaResidenciaTypes,
        grupoEtnicoTypes,
        puebloIndigenaTypes,
        otroPueblo,
        poseeDiscapacidadTypes,
        discapacidadTypes,
        capacidadxcepcionalTypes,
        workingState,
        tipoVinculacionTypes,
        workingEntity,
        workingCountry,
        workingTown.name,
        workingDirection,
        undergraduateStudies,
        postgraduateStudies,
        promedioPregrado,
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

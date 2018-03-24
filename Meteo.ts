

export class Meteo {
    constructor(
      public lieu: String,
      public annee: Number,
      public mois: Number,
      public jour: Number,
      public tmin: Float32Array,
      public tmax: Float32Array,
      public pluie: Float32Array,
      public soleil: Float32Array,
      public venmoyen: Float32Array,
      public ventmax: Float32Array,
      public ventdir: String,
      /* public champsDisponibles: {
        "lieu" : String,
        "annee" : Number,
        "mois"  : Number,
      }  */
    ) {
     console.log('création dataMeteo de '+lieu);
    }
  }
  
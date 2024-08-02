import registrationController from './registrationController'

export default (dependencies:any)=>{
return{
    registrationController:registrationController(dependencies),
}
}
import authenticationRouter from "./authenticationRouter";
import express from 'express'

export const routes=(dependencies:any)=>{
    const router=express.Router();
    router.use('/auth',authenticationRouter(dependencies))
    return router

}
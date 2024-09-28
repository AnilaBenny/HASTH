import { sendOtp } from "../../../../utils";
import { Request, Response } from "express";

export default(dependencies:any)=>{
    const searchController = async (req: Request, res: Response) => {
        try {
                const response = await sendOtp(req.body.email);
            
            if (response ) {
                console.log(response,'rs...');
                
                res.cookie('otp',response.otp , {
                    maxAge: 60000, 
                    secure: true,
                    sameSite:'none'
                  });
          
                res.json({ status: true });
            } else {
                res.status(400).json( "otp send failed" );
            }
        } catch (error) {
            console.error("Error in otp sendController:", error);
            res.status(500).json({ status: false, message: "Internal server error" });
        }
    };

    return searchController;
};

import { Request, Response, NextFunction } from "express";

export const hasAdminRole = (req: Request, res: Response, next: NextFunction) => {
  try{
    const checkAdminRole = req.user.roles?.some((r: string)=>r==='ADMIN');
    if (!checkAdminRole){
      console.log("Forbidden: Insufficient permissions");
      return res.status(403).json({message:"Forbidden: Insufficient permissions"});
    }
    next()
  } catch (err) {
    res.status(403).json({message: 'Not Admin role'})
  }
}
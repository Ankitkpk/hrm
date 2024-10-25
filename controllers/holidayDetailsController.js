const Holiday = require('../models/holidayDetailsModel');

const createHoliday = async (req, res) => {
    try {
      const { holidayTitle, date, type, location } = req.body;
  
      if (!holidayTitle || !date || !type || !location) {
        return res.status(400).json({ message: "All fields are required..." });
      }
  
      const allData = new Holiday({ holidayTitle, date, type, location });
  
      await allData.save();
     return res.status(200).json({
        message: "Holiday details saved successfully",
        data: allData,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error saving Holiday details",
        error: error.message,
      });
    }
  };
  

  const getHolidayByDate = async(req,res)=>{
    try{
        const {date} = req.query;

       if(!date){
           return res.status(400).json({message:"Provide any Date.."});
        }

        const holiday = await Holiday.find({date})

        if(holiday.length===0){
           return res.status(404).json({message:"There are no any holiday on this date"});
        }

       return res.status(200).json(holiday);
    }catch(error){
        return res.status(500).json({
            message: "Error  Holiday details",
            error: error.message,
          });
    }
  }

// const getHolidayByDate = async (req, res) => {
//     try {
//       const { date } = req.query;
  
//       if (!date) {
//         return res.status(400).json({ message: "Please provide a date." });
//       }
  
//       const holiday = await Holiday.find({ date });
  
//       if (holiday.length === 0) {
//         return res.status(404).json({ message: "No holidays found on this date." });
//       }
  
//       return res.status(200).json(holiday);
//     } catch (error) {
//       return res.status(500).json({
//         message: "Error retrieving holiday details",
//         error: error.message,
//       });
//     }
//   };

const getAllHolidayDetails = async (req,res)=>{
    try{
        const holidayDetails = await Holiday.find();

        if(!holidayDetails){
          return  res.status(404).json({message:"There are no data available.."})
        }

        return res.status(200).json(holidayDetails);

    }catch(error){
        return res.status(500).json({
            message: "Error In Holiday details",
            error: error.message,
          });
    }
}
  
  module.exports={
    createHoliday,
    getHolidayByDate,
    getAllHolidayDetails
  }
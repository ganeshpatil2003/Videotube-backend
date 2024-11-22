import mongoose,{Schema,model} from "mongoose"

const subscriptionSchema = new Schema({
    subscriber : {                                    // subscribed to
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    channel : {                                      // subscribers
        type : Schema.Types.ObjectId,
        ref : "User"
    }
},
{
    timestamps : true,
})

export const Subscription = model("Subscription", subscriptionSchema );
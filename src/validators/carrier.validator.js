import { object, string, number, date, array } from "yup";

export const CarrierSchemaValidator = object({
  name: string().required().min(3, ""),
  shipmentPrices: array(
    object({
      tag: string().required(),
      price: number(),
    })
  ),
});

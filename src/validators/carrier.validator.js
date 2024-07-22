import yup from "yup";

export const carrierSchema = yup.object().shape({
  name: yup
    .string()
    .required("O campo nome é obrigatório.")
    .min(1, "O nome deve ter pelo menos 1 caracteres."),
  shipmentPrices: yup
    .array()
    .of(
      yup.object().shape({
        regionType: yup
          .string()
          .oneOf(["city", "state", "all"], "Tipo de região inválido")
          .required("Tipo de região é obrigatório"),
        city: yup.string().required("O campo cidade é obrigatório."),
        state: yup.string().required("O campo estado é obrigatório."),
        price: yup
          .number()
          .typeError("O preço deve ser um número.")
          .required("O campo preço é obrigatório. "),
      })
    )
    .required("É necessário definir pelo menos uma regra de envio.")
    .min(1, "A transportadora deve ter pelo menos uma regra de envio."),
});

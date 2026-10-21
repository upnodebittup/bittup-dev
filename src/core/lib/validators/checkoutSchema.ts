import * as yup from 'yup';

const deliveryField = (message: string) => yup.string().default('').when('$digitalOnly', {
  is: true, then: schema => schema, otherwise: schema => schema.required(message),
});

export const checkoutSchema = yup.object({
  fullName: yup.string().trim().max(200).required('Nome completo é obrigatório'),
  email: yup.string().trim().lowercase().max(254).email('E-mail inválido').required('E-mail é obrigatório'),
  cpf: yup
    .string()
    .transform(value => typeof value === 'string' ? value.replace(/\D/g, '') : value)
    .matches(/^\d{11}$/, 'CPF deve conter 11 dígitos numéricos')
    .required('CPF é obrigatório'),
  phone: yup
    .string()
    .transform(value => typeof value === 'string' ? value.replace(/\D/g, '') : value)
    .matches(/^\d{10,11}$/, 'Telefone deve conter 10 ou 11 dígitos numéricos')
    .required('Telefone é obrigatório'),
  address: yup.object({
    street: deliveryField('Rua é obrigatória'),
    number: deliveryField('Número é obrigatório'),
    neighborhood: deliveryField('Bairro é obrigatório'),
    city: deliveryField('Cidade é obrigatória'),
    state: deliveryField('Estado é obrigatório'),
    zipCode: yup
      .string()
      .default('')
      .transform(value => typeof value === 'string' ? value.replace(/\D/g, '') : value)
      .when('$digitalOnly', { is: true, then: schema => schema, otherwise: schema => schema.matches(/^\d{8}$/, 'CEP deve conter 8 dígitos').required('CEP é obrigatório') }),
  }),
});

/*
    Quotes from: https://type.fit/api/quotes
*/
import {faker} from '@faker-js/faker'

export const getText = () => {
  return faker.lorem.paragraph(5)
};

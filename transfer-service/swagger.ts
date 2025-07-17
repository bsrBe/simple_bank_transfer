import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

// Load the swagger.yaml file
const swaggerDocument = yaml.load(fs.readFileSync('./swagger.yaml', 'utf8')) as object;

// Export the setupSwagger function
export function setupSwagger(app: Express): void {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
import { Request, Response } from "express";
import { QueryResult } from "pg";
import { client } from "./database";
import format from "pg-format";

const create = async (req: Request, res: Response): Promise<Response> => {
  const queryFormat: string = format(
    'INSERT INTO "movies" (%I) VALUES (%L) RETURNING*;',
    Object.keys(req.body),
    Object.values(req.body)
  );

  console.log(queryFormat);
  const queryResult: QueryResult = await client.query(queryFormat);

  return res.status(201).json(queryResult.rows[0]);
};

const read = async (req: Request, res: Response): Promise<Response> => {
  const queryResult: QueryResult = await client.query(
    'SELECT * FROM "movies";'
  );

  const queryCategory: string = 'SELECT * FROM "movies" WHERE category = $1';

  const queryResultsCategory: QueryResult = await client.query(queryCategory, [
    req.query.category,
  ]);
  if (queryResultsCategory.rowCount > 0) {
    return res.status(200).json(queryResultsCategory.rows);
  }

  return res.status(200).json(queryResult.rows);
};

const retrive = async (req: Request, res: Response): Promise<Response> => {
  return res.status(200).json(res.locals.foundMouves);
};

const updateParcial = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const queryFormat: string = format(
    'UPDATE "movies" SET (%I) = ROW (%L) WHERE "id" = %L RETURNING *; ',
    Object.keys(req.body),
    Object.values(req.body),
    req.params.id
  );
  const queryResult: QueryResult = await client.query(queryFormat);
  return res.status(200).json(queryResult.rows[0]);
};

const destroy = async (req: Request, res: Response): Promise<Response> => {
  await client.query('DELETE FROM "movies" WHERE "id"= $1;', [req.params.id]);
  return res.status(204).json();
};

export default { create, read, retrive, updateParcial, destroy };

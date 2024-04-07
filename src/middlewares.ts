import { NextFunction, Request, Response } from "express";
import { client } from "./database";
import { QueryResult } from "pg";

const idExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const queryResult: QueryResult = await client.query(
    'SELECT * FROM "movies" WHERE "id" = $1;',
    [req.params.id]
  );

  if (!queryResult.rows.length) {
    return res.status(404).json({ message: "Movie not found!" });
  }

  res.locals = { ...res.locals, foundMouves: queryResult.rows[0] };
  return next();
};

const nameExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const queryString: string = 'SELECT * FROM "movies" WHERE "name" = $1;';
  const queryResults: QueryResult = await client.query(queryString, [
    req.body.name,
  ]);

  if (queryResults.rowCount > 0) {
    return res.status(409).json({ message: "Movie name already exists!" });
  }
  return next();
};

export default { idExists, nameExists };

import express, { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';

//Test get puzzle

//      Partition on returned string: solved board, unsolved board

// Manual Test:
//      1. establish a connection with the server
//      2. request a board from the server
//      3. make a move on that board using the client api
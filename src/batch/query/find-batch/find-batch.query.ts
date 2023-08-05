export class FindBatchQuery {
  constructor(
    public readonly branchCode: string,
    public readonly batchNumber: number,
  ) {}
}

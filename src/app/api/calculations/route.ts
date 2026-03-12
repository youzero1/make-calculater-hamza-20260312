import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/database';
import { Calculation } from '@/entities/Calculation';

export async function GET() {
  try {
    const dataSource = await getDataSource();
    const repo = dataSource.getRepository(Calculation);
    const calculations = await repo.find({
      order: { createdAt: 'DESC' },
      take: 50,
    });
    return NextResponse.json({ calculations });
  } catch (error) {
    console.error('Error fetching calculations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch calculations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { operand1, operator, operand2, result } = body;

    if (
      operand1 === undefined ||
      operator === undefined ||
      operand2 === undefined ||
      result === undefined
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const dataSource = await getDataSource();
    const repo = dataSource.getRepository(Calculation);

    const calculation = repo.create({
      operand1: Number(operand1),
      operator: String(operator),
      operand2: Number(operand2),
      result: Number(result),
    });

    const saved = await repo.save(calculation);
    return NextResponse.json({ calculation: saved }, { status: 201 });
  } catch (error) {
    console.error('Error saving calculation:', error);
    return NextResponse.json(
      { error: 'Failed to save calculation' },
      { status: 500 }
    );
  }
}

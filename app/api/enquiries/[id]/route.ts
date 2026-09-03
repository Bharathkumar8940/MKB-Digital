import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getOwnerSession } from '../../../../lib/auth';
import { EnquiryStatusSchema } from '../../../../lib/validations';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getOwnerSession();
    if (!session || session.role !== 'OWNER') {
      return NextResponse.json(
        { error: 'Unauthorized: Only the owner can update enquiry status' },
        { status: 401 }
      );
    }

    const { id } = params;
    const body = await req.json();

    const validation = EnquiryStatusSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }

    const existing = await prisma.enquiry.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Enquiry not found' }, { status: 404 });
    }

    const updated = await prisma.enquiry.update({
      where: { id },
      data: { status: validation.data.status },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating enquiry:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getOwnerSession();
    if (!session || session.role !== 'OWNER') {
      return NextResponse.json(
        { error: 'Unauthorized: Only the owner can delete enquiries' },
        { status: 401 }
      );
    }

    const { id } = params;
    const existing = await prisma.enquiry.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ error: 'Enquiry not found' }, { status: 404 });
    }

    await prisma.enquiry.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Enquiry deleted successfully' });
  } catch (error) {
    console.error('Error deleting enquiry:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'pankhuri@aroramobilehub.com';
  const name = 'Pankhuri Kanchan';
  const passwordRaw = 'Pankhuri@Arora2026';
  const phone = '7300791957';

  const hashedPassword = await bcrypt.hash(passwordRaw, 10);

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    const updated = await prisma.user.update({
      where: { email },
      data: {
        name,
        password: hashedPassword,
        role: 'ADMIN',
        phone,
      },
    });
    console.log('Admin user updated successfully:', updated.email, updated.name, updated.role);
  } else {
    const created = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'ADMIN',
        phone,
      },
    });
    console.log('Admin user created successfully:', created.email, created.name, created.role);
  }

  // Also update or ensure default admin exists
  const defaultAdmin = await prisma.user.findFirst({
    where: { role: 'ADMIN' },
  });
  console.log('Active Admins in database:');
  const allAdmins = await prisma.user.findMany({ where: { role: 'ADMIN' } });
  console.log(allAdmins.map((a) => ({ name: a.name, email: a.email, role: a.role })));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import prisma from "../../config/prisma.js";

export const generateOTP = () => {
  return Math.floor(
    100000 + Math.random() * 900000
  ).toString();
};

export const createOTP = async (id, email) => {
  const otp = generateOTP();

  const expiresAt = new Date(
    Date.now() + 5 * 60 * 1000
  );

  await prisma.oTP.create({
    data: {
      userId: id,
      email,
      otp,
      expiresAt,
    },
  });

  return otp;
};
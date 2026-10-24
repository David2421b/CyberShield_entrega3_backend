import "dotenv/config";
import { PrismaClient, CourseCategory, UserRole } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const courses = [
  {
    title: "Hacking Ético y Pentesting Web",
    slug: "hacking-etico-pentesting-web",
    category: CourseCategory.RED_TEAM,
    level: "Intermedio",
    duration: "40 horas",
    price: "79.99",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",
    description: "Auditoría de aplicaciones web, OWASP Top 10, explotación de vulnerabilidades y elaboración de informes técnicos.",
  },
  {
    title: "Defensa de Redes y Monitoreo SOC",
    slug: "defensa-redes-monitoreo-soc",
    category: CourseCategory.BLUE_TEAM,
    level: "Principiante",
    duration: "35 horas",
    price: "69.99",
    image: "https://i.ytimg.com/vi/p08Bkpde1sI/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCsm7Zn6jr5IgKtzgeL68SsiX02Lg",
    description: "Análisis de tráfico de red con Wireshark, gestión de SIEM, detección de intrusos y respuesta a incidentes.",
  },
  {
    title: "Análisis Forense Digital y Malware",
    slug: "analisis-forense-digital-malware",
    category: CourseCategory.DFIR,
    level: "Avanzado",
    duration: "50 horas",
    price: "99.99",
    image: "https://img2.helpnetsecurity.com/posts2025/ghidra-650.webp",
    description: "Ingeniería inversa de binarios, extracción de memoria RAM, análisis de artifacts en Windows/Linux y cadena de custodia.",
  },
  {
    title: "Hardware Hacking y Seguridad en IoT",
    slug: "hardware-hacking-seguridad-iot",
    category: CourseCategory.RED_TEAM,
    level: "Avanzado",
    duration: "45 horas",
    price: "89.99",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    description: "Análisis de buses I2C, SPI y UART, extracción de firmware con Bus Pirate y vulnerabilidades en microcontroladores ESP32.",
  },
  {
    title: "Hardening y Seguridad en Servidores Linux",
    slug: "hardening-servidores-linux",
    category: CourseCategory.BLUE_TEAM,
    level: "Intermedio",
    duration: "30 horas",
    price: "59.99",
    image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=600&q=80",
    description: "Aseguramiento de Kernel Linux, gestión de permisos avanzados, implementación de SELinux/AppArmor y cortafuegos IPTables/UFW.",
  },
  {
    title: "Criptografía Aplicada y Protocolos Seguros",
    slug: "criptografia-aplicada-protocolos-seguros",
    category: CourseCategory.DFIR,
    level: "Intermedio",
    duration: "25 horas",
    price: "49.99",
    image: "https://plus.unsplash.com/premium_photo-1733317239304-a6bf462a2596?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Implementación de cifrado simétrico/asimétrico, funciones Hash, PKI, análisis de vulnerabilidades en SSL/TLS y SSH.",
  },
  {
    title: "Auditoría RF y Emulación con Flipper Zero",
    slug: "auditoria-rf-emulacion-flipper-zero",
    category: CourseCategory.RED_TEAM,
    level: "Principiante",
    duration: "30 horas",
    price: "64.99",
    image: "https://cdn.flipper.net/zero_landing_subghz_flipper.jpg",
    description: "Análisis e intercepción de señales Sub-1 GHz, emulación de tarjetas NFC/RFID, ataques BadUSB y desarrollo de aplicaciones en C para Flipper Zero.",
  },
  {
    title: "Radio Definida por Software (SDR) con HackRF One",
    slug: "radio-definida-software-hackrf-one",
    category: CourseCategory.RED_TEAM,
    level: "Avanzado",
    duration: "50 horas",
    price: "109.99",
    image: "https://greatscottgadgets.com/images/h1-preliminary1-445.jpeg",
    description: "Captura y replay de señales de radio de 1 MHz a 6 GHz con GNU Radio, análisis de protocolos GPS, GSM, ADS-B e inspección de espectro electromagnético.",
  },
];

async function main() {
  const adminPassword = await hash(process.env.DEMO_ADMIN_PASSWORD || "Admin123!", 12);
  const userPassword = await hash(process.env.DEMO_USER_PASSWORD || "User123!", 12);

  await prisma.user.upsert({
    where: { email: "admin@cybershield.local" },
    update: {},
    create: { name: "Admin CyberShield", email: "admin@cybershield.local", passwordHash: adminPassword, role: UserRole.admin },
  });
  await prisma.user.upsert({
    where: { email: "user@cybershield.local" },
    update: {},
    create: { name: "Usuario CyberShield", email: "user@cybershield.local", passwordHash: userPassword, role: UserRole.user },
  });

  for (const course of courses) {
    const { slug, ...data } = course;
    await prisma.course.upsert({ where: { slug }, update: {}, create: { slug, ...data } });
  }
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error: unknown) => {
    console.error("No se pudo cargar el seed:", error);
    await prisma.$disconnect();
    process.exitCode = 1;
  });

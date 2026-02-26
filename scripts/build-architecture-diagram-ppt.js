// Builds a PPTX architecture diagram using shapes and arrows
// Usage: node scripts/build-architecture-diagram-ppt.js
(async function () {
  const path = await import('node:path');
  const PptxGenJS = (await import('pptxgenjs')).default;

  const projectRoot = path.resolve(__dirname, '..', '..');
  const outPath = path.join(projectRoot, 'architecture-diagram.pptx');

  const pptx = new PptxGenJS();
  const slide = pptx.addSlide();

  // Title
  slide.addText('Event Ticketing – Architecture Diagram', {
    x: 0.5, y: 0.4, fontSize: 24, bold: true,
  });

  // Boxes
  const boxOpts = { fill: { color: 'F3F6FB' }, line: { color: '5A6B8C', width: 1.5 } };
  const labelOpts = { fontSize: 16, bold: true, color: '1C3144' };

  // Client
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0.5, y: 1.4, w: 3.5, h: 1.6, ...boxOpts });
  slide.addText('Expo React Native App', { x: 0.7, y: 1.6, ...labelOpts });
  slide.addText('• React Navigation\n• Redux Toolkit\n• REST API calls', { x: 0.7, y: 2.0, fontSize: 12 });

  // Backend
  slide.addShape(pptx.shapes.RECTANGLE, { x: 4.5, y: 1.2, w: 4.8, h: 2.4, ...boxOpts });
  slide.addText('Spring Boot Backend', { x: 4.7, y: 1.4, ...labelOpts });
  slide.addText('• Controllers (Events, Bookings)\n• Services (EventService, BookingService)\n• JPA Repositories\n• GlobalExceptionHandler', { x: 4.7, y: 1.8, fontSize: 12 });

  // Backend internals
  slide.addShape(pptx.shapes.RECTANGLE, { x: 4.7, y: 3.7, w: 2.0, h: 1.2, ...boxOpts });
  slide.addText('Controllers', { x: 4.9, y: 3.9, fontSize: 12, bold: true });
  slide.addShape(pptx.shapes.RECTANGLE, { x: 6.9, y: 3.7, w: 2.0, h: 1.2, ...boxOpts });
  slide.addText('Services', { x: 7.1, y: 3.9, fontSize: 12, bold: true });
  slide.addShape(pptx.shapes.RECTANGLE, { x: 4.7, y: 5.1, w: 2.0, h: 1.2, ...boxOpts });
  slide.addText('Repositories', { x: 4.9, y: 5.3, fontSize: 12, bold: true });

  // PostgreSQL
  slide.addShape(pptx.shapes.RECTANGLE, { x: 8.0, y: 5.0, w: 3.5, h: 1.6, ...boxOpts });
  slide.addText('PostgreSQL', { x: 8.2, y: 5.2, ...labelOpts });
  slide.addText('• Entities: Event, Seat,\n  Booking, User, Venue, Offer\n• JPA + indexes/constraints', { x: 8.2, y: 5.6, fontSize: 12 });

  // Redis
  slide.addShape(pptx.shapes.RECTANGLE, { x: 9.0, y: 2.0, w: 2.5, h: 1.6, ...boxOpts });
  slide.addText('Redis', { x: 9.2, y: 2.2, ...labelOpts });
  slide.addText('• hold:<event>:<seat>\n• resv:<reservation>', { x: 9.2, y: 2.6, fontSize: 12 });

  // Infra note
  slide.addText('Infra: Docker Compose (postgres:16, redis:7) • CORS allowed', { x: 0.5, y: 7.2, fontSize: 12, color: '2F3B52' });

  // Arrows
  const arrowOpts = { line: { color: '2F3B52', width: 2 }, endArrowType: 'triangle' };
  // Client -> Backend
  slide.addShape(pptx.shapes.LINE, { x: 4.0, y: 2.2, w: 0.5, h: 0, ...arrowOpts }); // short line
  slide.addShape(pptx.shapes.LINE, { x: 3.9, y: 2.2, w: 0.8, h: 0, ...arrowOpts });
  // Backend -> Postgres
  slide.addShape(pptx.shapes.LINE, { x: 7.0, y: 2.8, w: 2.0, h: 2.8, ...arrowOpts });
  // Backend <-> Redis
  slide.addShape(pptx.shapes.LINE, { x: 8.7, y: 2.6, w: 0.3, h: 0, ...arrowOpts });
  slide.addShape(pptx.shapes.LINE, { x: 8.5, y: 2.6, w: -0.3, h: 0, ...arrowOpts, flipH: true });

  await pptx.writeFile({ fileName: outPath });
  console.log('Wrote:', outPath);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

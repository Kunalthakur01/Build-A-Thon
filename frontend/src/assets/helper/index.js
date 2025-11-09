
export function drawSegment(ctx, [mx, my], [tx, ty], color) {
    ctx.beginPath();
    ctx.moveTo(mx, my);
    ctx.lineTo(tx, ty);
    ctx.lineWidth = 2;
    ctx.strokeStyle = color;
    // Add line glow effect
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.stroke();
    // Reset shadow to prevent affecting other drawings
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
}

export function drawPoint(ctx, x, y, r, color) {
    ctx.beginPath();
    // Add point glow effect
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    // Reset shadow to prevent affecting other drawings
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
}
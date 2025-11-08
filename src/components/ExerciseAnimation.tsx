import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { ExerciseRecommendation } from '../lib/services/physiotherapy';

interface ExerciseAnimationProps {
  exercise: ExerciseRecommendation;
  onClose: () => void;
  onComplete: () => void;
}

export function ExerciseAnimation({
  exercise,
  onClose,
  onComplete,
}: ExerciseAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    let frame = 0;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      const progress = (Date.now() - startTimeRef.current) / (exercise.duration_seconds * 1000);

      switch (exercise.animation_type) {
        case 'arm_swing':
          drawArmSwing(ctx, width, height, frame);
          break;
        case 'wall_slide':
          drawWallSlide(ctx, width, height, frame);
          break;
        case 'leg_extension':
          drawLegExtension(ctx, width, height, frame);
          break;
        case 'heel_slide':
          drawHeelSlide(ctx, width, height, frame);
          break;
        case 'spine_flex':
          drawSpineFlex(ctx, width, height, frame);
          break;
        case 'pelvic_tilt':
          drawPelvicTilt(ctx, width, height, frame);
          break;
        case 'neck_retraction':
          drawNeckRetraction(ctx, width, height, frame);
          break;
        case 'hip_rotation':
          drawHipRotation(ctx, width, height, frame);
          break;
        default:
          drawGenericExercise(ctx, width, height, frame);
      }

      frame++;

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        onComplete();
      }
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [exercise, onComplete]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">{exercise.name}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="bg-gray-50 rounded-xl p-8 mb-4">
            <canvas
              ref={canvasRef}
              width={600}
              height={400}
              className="w-full h-auto"
            />
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Follow these steps:</h3>
              <ol className="list-decimal list-inside space-y-2">
                {exercise.instructions.map((instruction, index) => (
                  <li key={index} className="text-gray-700">
                    {instruction}
                  </li>
                ))}
              </ol>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Duration:</strong> {exercise.duration_seconds} seconds |{' '}
                <strong>Repetitions:</strong> {exercise.repetitions}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function drawStickFigure(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  leftArmAngle: number = -0.3,
  rightArmAngle: number = 0.3,
  leftLegAngle: number = -0.2,
  rightLegAngle: number = 0.2
) {
  ctx.strokeStyle = '#1e40af';
  ctx.fillStyle = '#3b82f6';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const headSize = 15;
  const bodyLength = 50;
  const limbLength = 40;

  ctx.beginPath();
  ctx.arc(x, y, headSize, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  const bodyStartY = y + headSize;
  const bodyEndY = bodyStartY + bodyLength;

  ctx.beginPath();
  ctx.moveTo(x, bodyStartY);
  ctx.lineTo(x, bodyEndY);
  ctx.stroke();

  const shoulderY = bodyStartY + 10;

  ctx.beginPath();
  ctx.moveTo(x, shoulderY);
  ctx.lineTo(x + Math.cos(leftArmAngle) * limbLength, shoulderY + Math.sin(leftArmAngle) * limbLength);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x, shoulderY);
  ctx.lineTo(x + Math.cos(rightArmAngle) * limbLength, shoulderY + Math.sin(rightArmAngle) * limbLength);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x - 10, bodyEndY);
  ctx.lineTo(x - 10 + Math.sin(leftLegAngle) * limbLength, bodyEndY + Math.cos(leftLegAngle) * limbLength);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x + 10, bodyEndY);
  ctx.lineTo(x + 10 + Math.sin(rightLegAngle) * limbLength, bodyEndY + Math.cos(rightLegAngle) * limbLength);
  ctx.stroke();
}

function drawArmSwing(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  frame: number
) {
  const centerX = width / 2;
  const centerY = height / 2;
  const swingAngle = Math.sin(frame * 0.05) * 0.8;

  ctx.fillStyle = '#f0f9ff';
  ctx.fillRect(0, 0, width, height);

  ctx.font = '14px sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.fillText('Pendulum Swing', 20, 30);

  drawStickFigure(ctx, centerX, centerY - 60, swingAngle, -swingAngle, -0.1, 0.1);
}

function drawWallSlide(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  frame: number
) {
  const centerX = width / 2;
  const centerY = height / 2;
  const armProgress = Math.sin(frame * 0.03) * 0.5 + 0.5;

  ctx.fillStyle = '#f0f9ff';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#d1d5db';
  ctx.fillRect(centerX - 80, 80, 15, height - 160);

  ctx.font = '14px sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.fillText('Wall Angels', 20, 30);

  const leftArmAngle = -Math.PI / 2 + armProgress * 0.8;
  const rightArmAngle = -Math.PI / 2 + armProgress * 0.8;

  drawStickFigure(ctx, centerX - 60, centerY - 40, leftArmAngle, rightArmAngle, -0.1, 0.1);
}

function drawLegExtension(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  frame: number
) {
  const centerX = width / 2;
  const centerY = height / 2;
  const extension = Math.sin(frame * 0.04) * 0.6;

  ctx.fillStyle = '#f0f9ff';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#d1d5db';
  ctx.fillRect(centerX - 80, centerY + 60, 160, 12);

  ctx.font = '14px sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.fillText('Seated Knee Extension', 20, 30);

  const leftLegAngle = -0.1;
  const rightLegAngle = extension * 0.8;

  drawStickFigure(ctx, centerX, centerY - 60, -0.3, 0.3, leftLegAngle, rightLegAngle);
}

function drawHeelSlide(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  frame: number
) {
  const centerX = width / 2;
  const centerY = height / 2 + 30;
  const slideDistance = Math.sin(frame * 0.04);

  ctx.fillStyle = '#f0f9ff';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#d1d5db';
  ctx.fillRect(centerX - 100, centerY + 70, 200, 10);

  ctx.font = '14px sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.fillText('Heel Slides', 20, 30);

  drawStickFigure(
    ctx,
    centerX,
    centerY - 80,
    -0.2,
    0.2,
    slideDistance * 0.4,
    slideDistance * 0.4
  );
}

function drawSpineFlex(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  frame: number
) {
  const centerX = width / 2;
  const centerY = height / 2;
  const flexion = Math.sin(frame * 0.04) * 0.5;

  ctx.fillStyle = '#f0f9ff';
  ctx.fillRect(0, 0, width, height);

  ctx.font = '14px sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.fillText('Cat-Cow Stretch', 20, 30);

  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';

  if (flexion > 0) {
    ctx.beginPath();
    ctx.arc(centerX, centerY - 40, 12, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(centerX, centerY - 28);
    ctx.quadraticCurveTo(centerX, centerY + 20 - flexion * 30, centerX, centerY + 50);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(centerX - 50, centerY);
    ctx.lineTo(centerX - 50, centerY + 40);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(centerX + 50, centerY);
    ctx.lineTo(centerX + 50, centerY + 40);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.arc(centerX, centerY - 40, 12, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(centerX, centerY - 28);
    ctx.quadraticCurveTo(centerX, centerY - 20 - Math.abs(flexion) * 30, centerX, centerY + 50);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(centerX - 50, centerY - 10);
    ctx.lineTo(centerX - 50, centerY + 40);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(centerX + 50, centerY - 10);
    ctx.lineTo(centerX + 50, centerY + 40);
    ctx.stroke();
  }
}

function drawPelvicTilt(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  frame: number
) {
  const centerX = width / 2;
  const centerY = height / 2;
  const tilt = Math.sin(frame * 0.04) * 0.15;

  ctx.fillStyle = '#f0f9ff';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#d1d5db';
  ctx.fillRect(centerX - 100, centerY + 70, 200, 10);

  ctx.font = '14px sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.fillText('Pelvic Tilt', 20, 30);

  const displayTilt = tilt > 0 ? tilt * 0.6 : tilt * 0.3;
  drawStickFigure(ctx, centerX, centerY - 50, -0.3, 0.3, -0.1 + displayTilt, 0.1 + displayTilt);

  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 2;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(centerX - 40, centerY + 20);
  ctx.lineTo(centerX + 40, centerY + 20);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.strokeStyle = '#3b82f6';
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(centerX - 40, centerY + 20 + tilt * 20);
  ctx.lineTo(centerX + 40, centerY + 20 + tilt * 20);
  ctx.stroke();
}

function drawNeckRetraction(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  frame: number
) {
  const centerX = width / 2;
  const centerY = height / 2;
  const retraction = Math.sin(frame * 0.04) * 12;

  ctx.fillStyle = '#f0f9ff';
  ctx.fillRect(0, 0, width, height);

  ctx.font = '14px sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.fillText('Chin Tucks', 20, 30);

  ctx.strokeStyle = '#3b82f6';
  ctx.fillStyle = '#3b82f6';
  ctx.lineWidth = 3;

  ctx.beginPath();
  ctx.arc(centerX + retraction, centerY - 60, 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(centerX + retraction, centerY - 45);
  ctx.lineTo(centerX + retraction, centerY + 40);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(centerX + retraction - 30, centerY - 20);
  ctx.lineTo(centerX + retraction + 30, centerY - 20);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(centerX + retraction - 30, centerY + 10);
  ctx.lineTo(centerX + retraction + 30, centerY + 10);
  ctx.stroke();
}

function drawHipRotation(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  frame: number
) {
  const centerX = width / 2;
  const centerY = height / 2;
  const rotation = Math.sin(frame * 0.04) * 0.6;

  ctx.fillStyle = '#f0f9ff';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#d1d5db';
  ctx.fillRect(centerX - 100, centerY + 50, 200, 10);

  ctx.font = '14px sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.fillText('Clamshell Exercise', 20, 30);

  const leftLegAngle = -0.4 + rotation * 0.3;
  const rightLegAngle = -0.1 - rotation * 0.5;

  drawStickFigure(ctx, centerX, centerY - 40, -0.5, 0.3, leftLegAngle, rightLegAngle);
}

function drawGenericExercise(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  frame: number
) {
  const centerX = width / 2;
  const centerY = height / 2;

  ctx.fillStyle = '#f0f9ff';
  ctx.fillRect(0, 0, width, height);

  ctx.font = '14px sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.fillText('Exercise', 20, 30);

  drawStickFigure(ctx, centerX, centerY, -0.3, 0.3, -0.2, 0.2);
}

import React from 'react';
import { motion } from 'framer-motion';
import {
    Check, X, AlertTriangle, RefreshCw, Clock,
    Bug, TestTube2, Zap, Wrench, Bot, BarChart3,
    Rocket, MessageSquare, FileCode, FileType2,
    Pencil, Package, Palette, Lock, Brain,
    Heart, CheckCircle,
} from 'lucide-react';

// ─── Reduced Motion Helper ──────────────────────────────────────
const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

const anim = (props) => prefersReducedMotion ? {} : props;

// ─── Base Wrapper ───────────────────────────────────────────────
function IconWrap({ children, size = 20, className = '', ariaLabel, ...motionProps }) {
    return (
        <motion.span
            className={`inline-flex items-center justify-center ${className}`}
            style={{ width: size, height: size, willChange: 'transform' }}
            aria-label={ariaLabel}
            role="img"
            {...motionProps}
        >
            {children}
        </motion.span>
    );
}

// ═══════════════════════════════════════════════════════════
//  STATUS ICONS
// ═══════════════════════════════════════════════════════════

export function IconSuccess({ size = 20, className = '' }) {
    return (
        <IconWrap size={size} className={className} ariaLabel="Success"
            initial={anim({ scale: 0 })} animate={anim({ scale: 1 })}
            transition={{ type: 'spring', stiffness: 260, damping: 15 }}>
            <Check className="text-emerald-400" style={{ width: size, height: size }} />
        </IconWrap>
    );
}

export function IconError({ size = 20, className = '' }) {
    return (
        <IconWrap size={size} className={className} ariaLabel="Error"
            initial={anim({ scale: 0, rotate: -90 })} animate={anim({ scale: 1, rotate: 0 })}
            transition={{ type: 'spring', stiffness: 200 }}>
            <X className="text-red-400" style={{ width: size, height: size }} />
        </IconWrap>
    );
}

export function IconWarning({ size = 20, className = '' }) {
    return (
        <IconWrap size={size} className={className} ariaLabel="Warning"
            animate={anim({ opacity: [0.6, 1, 0.6] })}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
            <AlertTriangle className="text-amber-400" style={{ width: size, height: size }} />
        </IconWrap>
    );
}

export function IconLoading({ size = 20, className = '' }) {
    return (
        <IconWrap size={size} className={className} ariaLabel="Loading"
            animate={anim({ rotate: 360 })}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}>
            <RefreshCw className="text-blue-400" style={{ width: size, height: size }} />
        </IconWrap>
    );
}

export function IconClock({ size = 20, className = '' }) {
    return (
        <IconWrap size={size} className={className} ariaLabel="Pending"
            animate={anim({ opacity: [0.4, 1, 0.4] })}
            transition={{ duration: 1.5, repeat: Infinity }}>
            <Clock className="text-zinc-400" style={{ width: size, height: size }} />
        </IconWrap>
    );
}

// ═══════════════════════════════════════════════════════════
//  ACTION ICONS
// ═══════════════════════════════════════════════════════════

export function IconBot({ size = 20, className = '' }) {
    return (
        <IconWrap size={size} className={className} ariaLabel="Bot"
            initial={anim({ y: -3 })} animate={anim({ y: [0, -3, 0] })}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
            <Bot className="text-violet-400" style={{ width: size, height: size }} />
        </IconWrap>
    );
}

export function IconBrain({ size = 20, className = '' }) {
    return (
        <IconWrap size={size} className={className} ariaLabel="AI"
            animate={anim({ scale: [1, 1.1, 1] })}
            transition={{ duration: 2, repeat: Infinity }}>
            <Brain className="text-violet-400" style={{ width: size, height: size }} />
        </IconWrap>
    );
}

export function IconZap({ size = 20, className = '' }) {
    return (
        <IconWrap size={size} className={className} ariaLabel="Auto"
            animate={anim({ opacity: [0.6, 1, 0.6], scale: [0.95, 1.05, 0.95] })}
            transition={{ duration: 1.2, repeat: Infinity }}>
            <Zap className="text-blue-400" style={{ width: size, height: size }} />
        </IconWrap>
    );
}

export function IconBug({ size = 20, className = '' }) {
    return (
        <IconWrap size={size} className={className} ariaLabel="Bug"
            whileHover={anim({ rotate: [0, -10, 10, -10, 0] })}
            transition={{ duration: 0.5 }}>
            <Bug className="text-red-400" style={{ width: size, height: size }} />
        </IconWrap>
    );
}

export function IconTestTube({ size = 20, className = '' }) {
    return (
        <IconWrap size={size} className={className} ariaLabel="Test"
            animate={anim({ rotate: [0, 5, -5, 0] })}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
            <TestTube2 className="text-cyan-400" style={{ width: size, height: size }} />
        </IconWrap>
    );
}

export function IconWrench({ size = 20, className = '' }) {
    return (
        <IconWrap size={size} className={className} ariaLabel="Fix"
            whileHover={anim({ rotate: 20 })}
            transition={{ type: 'spring' }}>
            <Wrench className="text-amber-400" style={{ width: size, height: size }} />
        </IconWrap>
    );
}

export function IconChart({ size = 20, className = '' }) {
    return (
        <IconWrap size={size} className={className} ariaLabel="Chart"
            initial={anim({ scaleY: 0.5 })} animate={anim({ scaleY: 1 })}
            transition={{ duration: 0.4, delay: 0.1 }}>
            <BarChart3 className="text-blue-400" style={{ width: size, height: size }} />
        </IconWrap>
    );
}

export function IconRocket({ size = 20, className = '' }) {
    return (
        <IconWrap size={size} className={className} ariaLabel="Launch"
            whileHover={anim({ y: -4, scale: 1.15 })}
            transition={{ type: 'spring', stiffness: 300 }}>
            <Rocket className="text-orange-400" style={{ width: size, height: size }} />
        </IconWrap>
    );
}

export function IconMessage({ size = 20, className = '' }) {
    return (
        <IconWrap size={size} className={className} ariaLabel="Message"
            initial={anim({ opacity: 0, scale: 0.8 })} animate={anim({ opacity: 1, scale: 1 })}
            transition={{ duration: 0.3 }}>
            <MessageSquare className="text-sky-400" style={{ width: size, height: size }} />
        </IconWrap>
    );
}

export function IconHeart({ size = 20, className = '' }) {
    return (
        <IconWrap size={size} className={className} ariaLabel="Love"
            animate={anim({ scale: [1, 1.2, 1] })}
            transition={{ duration: 0.8, repeat: Infinity }}>
            <Heart className="text-pink-500 fill-pink-500" style={{ width: size, height: size }} />
        </IconWrap>
    );
}

export function IconCheckCircle({ size = 20, className = '' }) {
    return (
        <IconWrap size={size} className={className} ariaLabel="Verified"
            initial={anim({ scale: 0 })} animate={anim({ scale: 1 })}
            transition={{ type: 'spring', stiffness: 260, damping: 15 }}>
            <CheckCircle className="text-emerald-400" style={{ width: size, height: size }} />
        </IconWrap>
    );
}

// ═══════════════════════════════════════════════════════════
//  LANGUAGE ICONS (small SVG logos + animation)
// ═══════════════════════════════════════════════════════════

export function LangPython({ size = 24, className = '' }) {
    return (
        <IconWrap size={size} className={className} ariaLabel="Python"
            animate={anim({ y: [0, -2, 0] })}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}>
            <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
                <path d="M12 2C6.48 2 6 4.02 6 5.5V8h6v1H5.5C3.02 9 1 11 1 14s2.02 5 4.5 5H8v-3.5C8 13.02 10 11 12.5 11H17c1.1 0 2-.9 2-2V5.5C19 3.02 17 2 12 2zm-1.5 2a1 1 0 110 2 1 1 0 010-2z" fill="#3572A5" />
                <path d="M12 22c5.52 0 6-2.02 6-3.5V16h-6v-1h6.5c2.48 0 4.5-2 4.5-5s-2.02-5-4.5-5H16v3.5C16 11 14 13 11.5 13H7c-1.1 0-2 .9-2 2v3.5C5 20.98 7 22 12 22zm1.5-2a1 1 0 110-2 1 1 0 010 2z" fill="#FFD43B" />
            </svg>
        </IconWrap>
    );
}

export function LangJavaScript({ size = 24, className = '' }) {
    return (
        <IconWrap size={size} className={className} ariaLabel="JavaScript"
            animate={anim({ opacity: [0.7, 1, 0.7] })}
            transition={{ duration: 2, repeat: Infinity }}>
            <FileCode className="text-yellow-400" style={{ width: size, height: size }} />
        </IconWrap>
    );
}

export function LangTypeScript({ size = 24, className = '' }) {
    return (
        <IconWrap size={size} className={className} ariaLabel="TypeScript"
            animate={anim({ opacity: [0.7, 1, 0.7] })}
            transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}>
            <FileType2 className="text-blue-400" style={{ width: size, height: size }} />
        </IconWrap>
    );
}

export function LangGo({ size = 24, className = '' }) {
    return (
        <IconWrap size={size} className={className} ariaLabel="Go"
            whileHover={anim({ rotate: 10 })}
            transition={{ type: 'spring' }}>
            <svg viewBox="0 0 24 24" width={size} height={size}>
                <path d="M1.811 10.231c-.047 0-.058-.023-.035-.059l.246-.315c.023-.035.081-.058.128-.058h4.172c.046 0 .058.035.035.07l-.199.303c-.023.036-.082.07-.117.07zM.047 11.306c-.047 0-.059-.023-.035-.058l.245-.316c.023-.035.082-.058.129-.058h5.328c.047 0 .07.035.058.07l-.093.28c-.012.047-.058.07-.105.07zm2.828 1.075c-.047 0-.059-.035-.035-.07l.163-.292c.023-.035.07-.07.117-.07h2.337c.047 0 .07.035.07.082l-.023.28c0 .047-.047.082-.082.082zM18.615 10.078l-2.07.58c-.176.047-.187.058-.339-.117-.176-.199-.304-.327-.551-.444-.737-.362-1.452-.257-2.107.175-.773.515-1.171 1.276-1.159 2.222.012.934.654 1.706 1.576 1.835.793.105 1.452-.163 1.975-.791.105-.128.199-.269.327-.444H14.09c-.245 0-.304-.152-.222-.35.152-.362.432-.968.596-1.276.035-.07.117-.187.269-.187h4.066c-.023.35-.023.69-.082 1.04-.152.91-.478 1.753-.993 2.502-.842 1.228-1.952 2.06-3.352 2.397-.117.035-1.159.234-2.268-.082-1.065-.304-1.869-.993-2.397-1.963-.457-.84-.596-1.753-.503-2.713.128-1.322.69-2.467 1.647-3.399.979-.955 2.163-1.51 3.549-1.626 1.101-.093 2.115.117 3.018.757.585.409 1.03.944 1.335 1.6.082.14.035.222-.14.269z" fill="#00ADD8" />
            </svg>
        </IconWrap>
    );
}

// ═══════════════════════════════════════════════════════════
//  PREFERENCE / CATEGORY ICONS
// ═══════════════════════════════════════════════════════════

export function IconPencil({ size = 16, className = '' }) {
    return (
        <IconWrap size={size} className={className} ariaLabel="Syntax"
            whileHover={anim({ rotate: -15 })}>
            <Pencil className="text-current" style={{ width: size, height: size }} />
        </IconWrap>
    );
}

export function IconPackage({ size = 16, className = '' }) {
    return (
        <IconWrap size={size} className={className} ariaLabel="Imports"
            whileHover={anim({ y: -2 })}>
            <Package className="text-current" style={{ width: size, height: size }} />
        </IconWrap>
    );
}

export function IconPalette({ size = 16, className = '' }) {
    return (
        <IconWrap size={size} className={className} ariaLabel="Formatting"
            whileHover={anim({ rotate: 15 })}>
            <Palette className="text-current" style={{ width: size, height: size }} />
        </IconWrap>
    );
}

export function IconLock({ size = 16, className = '' }) {
    return (
        <IconWrap size={size} className={className} ariaLabel="Security"
            whileHover={anim({ scale: 1.1 })}>
            <Lock className="text-current" style={{ width: size, height: size }} />
        </IconWrap>
    );
}

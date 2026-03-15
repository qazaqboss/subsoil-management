import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import ProgressBar from '../components/ui/ProgressBar'

type WellStatus = 'drilling' | 'testing' | 'production' | 'passportization' | 'completed' | 'suspended'

interface Well {
  id: string
  number: string
  field: string
  license: string
  licenseId: string
  status: WellStatus
  designDepth: number
  currentDepth: number
  contractor: string
  startDate: string
  progress: number
  criticalDocs: number
  overdueDocs: number
  supervisor: string
}

const WELLS_DATA: Well[] = [
  // ── Каражанбас (МГ-00123) — 15 скважин ──
  { id: '45', number: '45', field: 'Каражанбас', license: 'МГ-00123', licenseId: '1', status: 'production',      designDepth: 3500, currentDepth: 3500, contractor: 'ТОО "MunaiService"',  startDate: '15.01.2025', progress: 100, criticalDocs: 8,  overdueDocs: 0, supervisor: 'Ахметов Б.К.' },
  { id: '46', number: '46', field: 'Каражанбас', license: 'МГ-00123', licenseId: '1', status: 'production',      designDepth: 3200, currentDepth: 3200, contractor: 'ТОО "MunaiService"',  startDate: '20.02.2025', progress: 100, criticalDocs: 8,  overdueDocs: 0, supervisor: 'Ахметов Б.К.' },
  { id: '47', number: '47', field: 'Каражанбас', license: 'МГ-00123', licenseId: '1', status: 'testing',         designDepth: 3800, currentDepth: 3785, contractor: 'ТОО "KazDrilling"',   startDate: '01.03.2026', progress: 50,  criticalDocs: 5,  overdueDocs: 1, supervisor: 'Иванов И.И.' },
  { id: '48', number: '48', field: 'Каражанбас', license: 'МГ-00123', licenseId: '1', status: 'drilling',        designDepth: 2450, currentDepth: 1200, contractor: 'ТОО "KazDrilling"',   startDate: '10.03.2026', progress: 49,  criticalDocs: 2,  overdueDocs: 0, supervisor: 'Петров С.А.' },
  { id: '49', number: '49', field: 'Каражанбас', license: 'МГ-00123', licenseId: '1', status: 'suspended',       designDepth: 4000, currentDepth: 1800, contractor: 'ТОО "KazDrilling"',   startDate: '15.02.2026', progress: 45,  criticalDocs: 3,  overdueDocs: 2, supervisor: 'Иванов И.И.' },
  { id: '50', number: '50', field: 'Каражанбас', license: 'МГ-00123', licenseId: '1', status: 'drilling',        designDepth: 3200, currentDepth: 1500, contractor: 'ТОО "KazDrilling"',   startDate: '20.02.2026', progress: 47,  criticalDocs: 1,  overdueDocs: 0, supervisor: 'Петров С.А.' },
  { id: '51', number: '51', field: 'Каражанбас', license: 'МГ-00123', licenseId: '1', status: 'production',      designDepth: 3400, currentDepth: 3400, contractor: 'ТОО "MunaiService"',  startDate: '01.05.2025', progress: 100, criticalDocs: 9,  overdueDocs: 0, supervisor: 'Ахметов Б.К.' },
  { id: '52', number: '52', field: 'Каражанбас', license: 'МГ-00123', licenseId: '1', status: 'production',      designDepth: 3100, currentDepth: 3100, contractor: 'ТОО "MunaiService"',  startDate: '10.07.2024', progress: 100, criticalDocs: 7,  overdueDocs: 0, supervisor: 'Ахметов Б.К.' },
  { id: '53', number: '53', field: 'Каражанбас', license: 'МГ-00123', licenseId: '1', status: 'drilling',        designDepth: 4200, currentDepth:  800, contractor: 'АО "CaspianDrill"',   startDate: '01.03.2026', progress: 19,  criticalDocs: 0,  overdueDocs: 0, supervisor: 'Альжанов С.Т.' },
  { id: '54', number: '54', field: 'Каражанбас', license: 'МГ-00123', licenseId: '1', status: 'passportization', designDepth: 3800, currentDepth: 3800, contractor: 'АО "CaspianDrill"',   startDate: '15.10.2025', progress: 65,  criticalDocs: 5,  overdueDocs: 0, supervisor: 'Альжанов С.Т.' },
  { id: '55', number: '55', field: 'Каражанбас', license: 'МГ-00123', licenseId: '1', status: 'production',      designDepth: 2900, currentDepth: 2900, contractor: 'ТОО "MunaiService"',  startDate: '20.06.2023', progress: 100, criticalDocs: 11, overdueDocs: 0, supervisor: 'Ахметов Б.К.' },
  { id: '56', number: '56', field: 'Каражанбас', license: 'МГ-00123', licenseId: '1', status: 'completed',       designDepth: 3600, currentDepth: 3600, contractor: 'ТОО "KazDrilling"',   startDate: '10.04.2024', progress: 100, criticalDocs: 8,  overdueDocs: 0, supervisor: 'Иванов И.И.' },
  { id: '57', number: '57', field: 'Каражанбас', license: 'МГ-00123', licenseId: '1', status: 'drilling',        designDepth: 3500, currentDepth: 1200, contractor: 'ТОО "GeoService"',    startDate: '15.03.2026', progress: 34,  criticalDocs: 2,  overdueDocs: 0, supervisor: 'Берикова Г.М.' },
  { id: '58', number: '58', field: 'Каражанбас', license: 'МГ-00123', licenseId: '1', status: 'testing',         designDepth: 4100, currentDepth: 4050, contractor: 'АО "CaspianDrill"',   startDate: '15.01.2026', progress: 45,  criticalDocs: 3,  overdueDocs: 0, supervisor: 'Альжанов С.Т.' },
  { id: '59', number: '59', field: 'Каражанбас', license: 'МГ-00123', licenseId: '1', status: 'production',      designDepth: 3300, currentDepth: 3300, contractor: 'ТОО "MunaiService"',  startDate: '01.09.2024', progress: 100, criticalDocs: 10, overdueDocs: 0, supervisor: 'Ахметов Б.К.' },

  // ── Жанажол (МГ-00789) — 15 скважин ──
  { id: '12', number: '12', field: 'Жанажол',    license: 'МГ-00789', licenseId: '3', status: 'passportization', designDepth: 4100, currentDepth: 4100, contractor: 'АО "CaspianDrill"',   startDate: '05.11.2025', progress: 75,  criticalDocs: 6,  overdueDocs: 0, supervisor: 'Сейтов Н.А.' },
  { id: '13', number: '13', field: 'Жанажол',    license: 'МГ-00789', licenseId: '3', status: 'drilling',        designDepth: 4500, currentDepth: 2000, contractor: 'АО "CaspianDrill"',   startDate: '01.02.2026', progress: 44,  criticalDocs: 1,  overdueDocs: 0, supervisor: 'Сейтов Н.А.' },
  { id: '14', number: '14', field: 'Жанажол',    license: 'МГ-00789', licenseId: '3', status: 'production',      designDepth: 4200, currentDepth: 4200, contractor: 'ТОО "MunaiService"',  startDate: '15.03.2024', progress: 100, criticalDocs: 12, overdueDocs: 0, supervisor: 'Ахметов Б.К.' },
  { id: '15', number: '15', field: 'Жанажол',    license: 'МГ-00789', licenseId: '3', status: 'completed',       designDepth: 3900, currentDepth: 3900, contractor: 'АО "CaspianDrill"',   startDate: '01.06.2024', progress: 100, criticalDocs: 10, overdueDocs: 0, supervisor: 'Сейтов Н.А.' },
  { id: '16', number: '16', field: 'Жанажол',    license: 'МГ-00789', licenseId: '3', status: 'drilling',        designDepth: 4300, currentDepth: 2100, contractor: 'АО "CaspianDrill"',   startDate: '05.03.2026', progress: 49,  criticalDocs: 2,  overdueDocs: 0, supervisor: 'Альжанов С.Т.' },
  { id: '17', number: '17', field: 'Жанажол',    license: 'МГ-00789', licenseId: '3', status: 'production',      designDepth: 4050, currentDepth: 4050, contractor: 'ТОО "MunaiService"',  startDate: '10.08.2024', progress: 100, criticalDocs: 9,  overdueDocs: 0, supervisor: 'Ахметов Б.К.' },
  { id: '18', number: '18', field: 'Жанажол',    license: 'МГ-00789', licenseId: '3', status: 'testing',         designDepth: 4600, currentDepth: 4550, contractor: 'АО "CaspianDrill"',   startDate: '01.02.2026', progress: 50,  criticalDocs: 4,  overdueDocs: 0, supervisor: 'Альжанов С.Т.' },
  { id: '19', number: '19', field: 'Жанажол',    license: 'МГ-00789', licenseId: '3', status: 'production',      designDepth: 4100, currentDepth: 4100, contractor: 'ТОО "MunaiService"',  startDate: '20.11.2023', progress: 100, criticalDocs: 9,  overdueDocs: 0, supervisor: 'Ахметов Б.К.' },
  { id: '20', number: '20', field: 'Жанажол',    license: 'МГ-00789', licenseId: '3', status: 'passportization', designDepth: 4400, currentDepth: 4400, contractor: 'АО "CaspianDrill"',   startDate: '01.01.2026', progress: 80,  criticalDocs: 6,  overdueDocs: 0, supervisor: 'Сейтов Н.А.' },
  { id: '21', number: '21', field: 'Жанажол',    license: 'МГ-00789', licenseId: '3', status: 'suspended',       designDepth: 4800, currentDepth: 2200, contractor: 'ТОО "KazDrilling"',   startDate: '10.01.2026', progress: 46,  criticalDocs: 0,  overdueDocs: 1, supervisor: 'Иванов И.И.' },
  { id: '31', number: '31', field: 'Жанажол',    license: 'МГ-00789', licenseId: '3', status: 'completed',       designDepth: 3900, currentDepth: 3900, contractor: 'АО "CaspianDrill"',   startDate: '01.06.2023', progress: 100, criticalDocs: 10, overdueDocs: 0, supervisor: 'Сейтов Н.А.' },
  { id: '32', number: '32', field: 'Жанажол',    license: 'МГ-00789', licenseId: '3', status: 'production',      designDepth: 4300, currentDepth: 4300, contractor: 'ТОО "MunaiService"',  startDate: '01.07.2023', progress: 100, criticalDocs: 8,  overdueDocs: 0, supervisor: 'Ахметов Б.К.' },
  { id: '33', number: '33', field: 'Жанажол',    license: 'МГ-00789', licenseId: '3', status: 'drilling',        designDepth: 4700, currentDepth: 1500, contractor: 'АО "CaspianDrill"',   startDate: '10.03.2026', progress: 32,  criticalDocs: 0,  overdueDocs: 0, supervisor: 'Альжанов С.Т.' },
  { id: '34', number: '34', field: 'Жанажол',    license: 'МГ-00789', licenseId: '3', status: 'testing',         designDepth: 4250, currentDepth: 4200, contractor: 'АО "CaspianDrill"',   startDate: '10.02.2026', progress: 48,  criticalDocs: 2,  overdueDocs: 0, supervisor: 'Сейтов Н.А.' },
  { id: '35', number: '35', field: 'Жанажол',    license: 'МГ-00789', licenseId: '3', status: 'production',      designDepth: 4150, currentDepth: 4150, contractor: 'ТОО "MunaiService"',  startDate: '01.10.2024', progress: 100, criticalDocs: 7,  overdueDocs: 0, supervisor: 'Ахметов Б.К.' },

  // ── Сарыланское (РГ-00456) — 10 скважин ──
  { id: 's1',  number: '1',  field: 'Сарыланское', license: 'РГ-00456', licenseId: '2', status: 'production',      designDepth: 2700, currentDepth: 2700, contractor: 'ТОО "GeoService"',   startDate: '01.06.2022', progress: 100, criticalDocs: 6,  overdueDocs: 0, supervisor: 'Берикова Г.М.' },
  { id: 's2',  number: '2',  field: 'Сарыланское', license: 'РГ-00456', licenseId: '2', status: 'production',      designDepth: 2500, currentDepth: 2500, contractor: 'ТОО "GeoService"',   startDate: '15.08.2022', progress: 100, criticalDocs: 5,  overdueDocs: 0, supervisor: 'Берикова Г.М.' },
  { id: 's3',  number: '3',  field: 'Сарыланское', license: 'РГ-00456', licenseId: '2', status: 'drilling',        designDepth: 2800, currentDepth:  900, contractor: 'ТОО "GeoService"',   startDate: '01.03.2026', progress: 32,  criticalDocs: 1,  overdueDocs: 0, supervisor: 'Берикова Г.М.' },
  { id: 's4',  number: '4',  field: 'Сарыланское', license: 'РГ-00456', licenseId: '2', status: 'testing',         designDepth: 2600, currentDepth: 2580, contractor: 'ТОО "GeoService"',   startDate: '10.01.2026', progress: 70,  criticalDocs: 4,  overdueDocs: 0, supervisor: 'Берикова Г.М.' },
  { id: 's5',  number: '5',  field: 'Сарыланское', license: 'РГ-00456', licenseId: '2', status: 'completed',       designDepth: 2900, currentDepth: 2900, contractor: 'ТОО "GeoService"',   startDate: '01.03.2023', progress: 100, criticalDocs: 9,  overdueDocs: 0, supervisor: 'Берикова Г.М.' },
  { id: 's6',  number: '6',  field: 'Сарыланское', license: 'РГ-00456', licenseId: '2', status: 'production',      designDepth: 2800, currentDepth: 2800, contractor: 'ТОО "GeoService"',   startDate: '20.10.2023', progress: 100, criticalDocs: 8,  overdueDocs: 0, supervisor: 'Берикова Г.М.' },
  { id: 's7',  number: '7',  field: 'Сарыланское', license: 'РГ-00456', licenseId: '2', status: 'drilling',        designDepth: 3000, currentDepth:  600, contractor: 'ТОО "GeoService"',   startDate: '01.03.2026', progress: 20,  criticalDocs: 0,  overdueDocs: 0, supervisor: 'Берикова Г.М.' },
  { id: 's8',  number: '8',  field: 'Сарыланское', license: 'РГ-00456', licenseId: '2', status: 'passportization', designDepth: 2750, currentDepth: 2750, contractor: 'ТОО "GeoService"',   startDate: '15.01.2026', progress: 70,  criticalDocs: 3,  overdueDocs: 0, supervisor: 'Берикова Г.М.' },
  { id: 's9',  number: '9',  field: 'Сарыланское', license: 'РГ-00456', licenseId: '2', status: 'drilling',        designDepth: 2850, currentDepth:  400, contractor: 'ТОО "GeoService"',   startDate: '10.03.2026', progress: 14,  criticalDocs: 0,  overdueDocs: 0, supervisor: 'Берикова Г.М.' },
  { id: 's10', number: '10', field: 'Сарыланское', license: 'РГ-00456', licenseId: '2', status: 'production',      designDepth: 2600, currentDepth: 2600, contractor: 'ТОО "GeoService"',   startDate: '01.01.2024', progress: 100, criticalDocs: 7,  overdueDocs: 0, supervisor: 'Берикова Г.М.' },

  // ── Узень (МГ-00789) — 10 скважин ──
  { id: '22',  number: '22', field: 'Узень',        license: 'МГ-00789', licenseId: '3', status: 'production',      designDepth: 3600, currentDepth: 3600, contractor: 'ТОО "MunaiService"',  startDate: '01.04.2023', progress: 100, criticalDocs: 11, overdueDocs: 0, supervisor: 'Жексенов А.О.' },
  { id: '23',  number: '23', field: 'Узень',        license: 'МГ-00789', licenseId: '3', status: 'passportization', designDepth: 3750, currentDepth: 3750, contractor: 'АО "CaspianDrill"',   startDate: '01.12.2025', progress: 88,  criticalDocs: 7,  overdueDocs: 0, supervisor: 'Альжанов С.Т.' },
  { id: 'u70', number: '70', field: 'Узень',        license: 'МГ-00789', licenseId: '3', status: 'production',      designDepth: 3700, currentDepth: 3700, contractor: 'ТОО "MunaiService"',  startDate: '01.05.2022', progress: 100, criticalDocs: 10, overdueDocs: 0, supervisor: 'Жексенов А.О.' },
  { id: 'u71', number: '71', field: 'Узень',        license: 'МГ-00789', licenseId: '3', status: 'production',      designDepth: 3800, currentDepth: 3800, contractor: 'ТОО "MunaiService"',  startDate: '20.08.2022', progress: 100, criticalDocs: 9,  overdueDocs: 0, supervisor: 'Жексенов А.О.' },
  { id: 'u72', number: '72', field: 'Узень',        license: 'МГ-00789', licenseId: '3', status: 'testing',         designDepth: 4000, currentDepth: 3950, contractor: 'АО "CaspianDrill"',   startDate: '01.01.2026', progress: 52,  criticalDocs: 5,  overdueDocs: 0, supervisor: 'Альжанов С.Т.' },
  { id: 'u73', number: '73', field: 'Узень',        license: 'МГ-00789', licenseId: '3', status: 'drilling',        designDepth: 4100, currentDepth: 1800, contractor: 'ТОО "KazDrilling"',   startDate: '15.02.2026', progress: 44,  criticalDocs: 1,  overdueDocs: 0, supervisor: 'Иванов И.И.' },
  { id: 'u74', number: '74', field: 'Узень',        license: 'МГ-00789', licenseId: '3', status: 'production',      designDepth: 3900, currentDepth: 3900, contractor: 'ТОО "MunaiService"',  startDate: '01.03.2023', progress: 100, criticalDocs: 11, overdueDocs: 0, supervisor: 'Жексенов А.О.' },
  { id: 'u75', number: '75', field: 'Узень',        license: 'МГ-00789', licenseId: '3', status: 'completed',       designDepth: 3600, currentDepth: 3600, contractor: 'АО "CaspianDrill"',   startDate: '01.10.2024', progress: 100, criticalDocs: 8,  overdueDocs: 0, supervisor: 'Альжанов С.Т.' },
  { id: 'u76', number: '76', field: 'Узень',        license: 'МГ-00789', licenseId: '3', status: 'drilling',        designDepth: 4200, currentDepth:  900, contractor: 'ТОО "KazDrilling"',   startDate: '01.03.2026', progress: 21,  criticalDocs: 0,  overdueDocs: 0, supervisor: 'Иванов И.И.' },
  { id: 'u77', number: '77', field: 'Узень',        license: 'МГ-00789', licenseId: '3', status: 'passportization', designDepth: 3750, currentDepth: 3750, contractor: 'АО "CaspianDrill"',   startDate: '15.12.2025', progress: 72,  criticalDocs: 4,  overdueDocs: 0, supervisor: 'Альжанов С.Т.' },

  // ── Тенгиз (МГ-00123) — 10 скважин ──
  { id: 't80', number: '80', field: 'Тенгиз',       license: 'МГ-00123', licenseId: '1', status: 'production',      designDepth: 5200, currentDepth: 5200, contractor: 'ТОО "MunaiService"',  startDate: '01.04.2020', progress: 100, criticalDocs: 14, overdueDocs: 0, supervisor: 'Жексенов А.О.' },
  { id: 't81', number: '81', field: 'Тенгиз',       license: 'МГ-00123', licenseId: '1', status: 'production',      designDepth: 5400, currentDepth: 5400, contractor: 'ТОО "MunaiService"',  startDate: '15.06.2020', progress: 100, criticalDocs: 13, overdueDocs: 0, supervisor: 'Жексенов А.О.' },
  { id: 't82', number: '82', field: 'Тенгиз',       license: 'МГ-00123', licenseId: '1', status: 'production',      designDepth: 5100, currentDepth: 5100, contractor: 'АО "CaspianDrill"',   startDate: '01.09.2021', progress: 100, criticalDocs: 12, overdueDocs: 0, supervisor: 'Альжанов С.Т.' },
  { id: 't83', number: '83', field: 'Тенгиз',       license: 'МГ-00123', licenseId: '1', status: 'drilling',        designDepth: 5800, currentDepth: 2000, contractor: 'АО "CaspianDrill"',   startDate: '01.02.2026', progress: 34,  criticalDocs: 2,  overdueDocs: 0, supervisor: 'Альжанов С.Т.' },
  { id: 't84', number: '84', field: 'Тенгиз',       license: 'МГ-00123', licenseId: '1', status: 'testing',         designDepth: 5600, currentDepth: 5500, contractor: 'АО "CaspianDrill"',   startDate: '01.12.2025', progress: 55,  criticalDocs: 6,  overdueDocs: 0, supervisor: 'Альжанов С.Т.' },
  { id: 't85', number: '85', field: 'Тенгиз',       license: 'МГ-00123', licenseId: '1', status: 'production',      designDepth: 5300, currentDepth: 5300, contractor: 'ТОО "MunaiService"',  startDate: '20.01.2022', progress: 100, criticalDocs: 13, overdueDocs: 0, supervisor: 'Жексенов А.О.' },
  { id: 't86', number: '86', field: 'Тенгиз',       license: 'МГ-00123', licenseId: '1', status: 'drilling',        designDepth: 6000, currentDepth: 1500, contractor: 'АО "CaspianDrill"',   startDate: '15.03.2026', progress: 25,  criticalDocs: 1,  overdueDocs: 0, supervisor: 'Альжанов С.Т.' },
  { id: 't87', number: '87', field: 'Тенгиз',       license: 'МГ-00123', licenseId: '1', status: 'passportization', designDepth: 5500, currentDepth: 5500, contractor: 'АО "CaspianDrill"',   startDate: '01.10.2025', progress: 60,  criticalDocs: 7,  overdueDocs: 0, supervisor: 'Альжанов С.Т.' },
  { id: 't88', number: '88', field: 'Тенгиз',       license: 'МГ-00123', licenseId: '1', status: 'suspended',       designDepth: 5900, currentDepth: 3000, contractor: 'ТОО "KazDrilling"',   startDate: '01.01.2026', progress: 51,  criticalDocs: 0,  overdueDocs: 1, supervisor: 'Иванов И.И.' },
  { id: 't89', number: '89', field: 'Тенгиз',       license: 'МГ-00123', licenseId: '1', status: 'production',      designDepth: 5250, currentDepth: 5250, contractor: 'ТОО "MunaiService"',  startDate: '01.07.2022', progress: 100, criticalDocs: 12, overdueDocs: 0, supervisor: 'Жексенов А.О.' },
]

const statusConfig: Record<WellStatus, { label: string; variant: 'success' | 'warning' | 'error' | 'info' | 'default'; dot: string }> = {
  drilling:       { label: 'Бурение',       variant: 'info',    dot: 'bg-info-500' },
  testing:        { label: 'Испытание',      variant: 'warning', dot: 'bg-warning-500' },
  production:     { label: 'Добыча',         variant: 'success', dot: 'bg-success-500' },
  passportization:{ label: 'Паспортизация',  variant: 'info',    dot: 'bg-blue-400' },
  completed:      { label: 'Завершена',      variant: 'default', dot: 'bg-gray-400' },
  suspended:      { label: 'Остановлена',    variant: 'error',   dot: 'bg-error-500' },
}

const STATUS_OPTIONS = [
  { value: '', label: 'Все статусы' },
  { value: 'drilling',        label: '🔵 Бурение' },
  { value: 'testing',         label: '🟡 Испытание' },
  { value: 'production',      label: '🟢 Добыча' },
  { value: 'passportization', label: '🔵 Паспортизация' },
  { value: 'completed',       label: '⚫ Завершена' },
  { value: 'suspended',       label: '🔴 Остановлена' },
]

const FIELDS = ['', 'Каражанбас', 'Жанажол', 'Сарыланское', 'Узень', 'Тенгиз']

// ───────────────────────────── New Well Modal ──────────────────────────────
interface NewWellModalProps { onClose: () => void; onSave: (w: Well) => void }

function NewWellModal({ onClose, onSave }: NewWellModalProps) {
  const [form, setForm] = useState({
    number: '', field: 'Каражанбас', license: 'МГ-00123', licenseId: '1',
    designDepth: '', contractor: '', startDate: '', supervisor: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.number.trim()) e.number = 'Укажите номер'
    if (!form.designDepth || isNaN(+form.designDepth)) e.designDepth = 'Укажите глубину'
    if (!form.contractor.trim()) e.contractor = 'Укажите подрядчика'
    if (!form.startDate.trim()) e.startDate = 'Укажите дату'
    if (!form.supervisor.trim()) e.supervisor = 'Укажите супервайзера'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    const well: Well = {
      id: form.number,
      number: form.number,
      field: form.field,
      license: form.license,
      licenseId: form.licenseId,
      status: 'drilling',
      designDepth: +form.designDepth,
      currentDepth: 0,
      contractor: form.contractor,
      startDate: form.startDate,
      progress: 0,
      criticalDocs: 0,
      overdueDocs: 0,
      supervisor: form.supervisor,
    }
    onSave(well)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40" onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white rounded-xl shadow-xl w-full max-w-lg z-10"
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-bold text-gray-900">🏗️ Новая скважина</h2>
            <p className="text-xs text-gray-500 mt-0.5">Заполните основные данные</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal body */}
        <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Номер скважины *</label>
              <input
                className={`input ${errors.number ? 'border-error-500' : ''}`}
                placeholder="например, 50"
                value={form.number}
                onChange={e => set('number', e.target.value)}
              />
              {errors.number && <p className="text-xs text-error-500 mt-1">{errors.number}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Проектная глубина (м) *</label>
              <input
                className={`input ${errors.designDepth ? 'border-error-500' : ''}`}
                placeholder="например, 3500"
                type="number"
                value={form.designDepth}
                onChange={e => set('designDepth', e.target.value)}
              />
              {errors.designDepth && <p className="text-xs text-error-500 mt-1">{errors.designDepth}</p>}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Месторождение</label>
            <select className="input" value={form.field} onChange={e => set('field', e.target.value)}>
              {FIELDS.filter(Boolean).map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Лицензия</label>
            <select className="input" value={form.license} onChange={e => {
              const map: Record<string, string> = { 'МГ-00123': '1', 'МГ-00789': '3', 'РГ-00456': '2' }
              set('license', e.target.value)
              set('licenseId', map[e.target.value] || '1')
            }}>
              {['МГ-00123', 'МГ-00789', 'РГ-00456'].map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Буровой подрядчик *</label>
            <input
              className={`input ${errors.contractor ? 'border-error-500' : ''}`}
              placeholder='ТОО "KazDrilling"'
              value={form.contractor}
              onChange={e => set('contractor', e.target.value)}
            />
            {errors.contractor && <p className="text-xs text-error-500 mt-1">{errors.contractor}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Дата забуривания *</label>
              <input
                className={`input ${errors.startDate ? 'border-error-500' : ''}`}
                type="date"
                value={form.startDate}
                onChange={e => set('startDate', e.target.value)}
              />
              {errors.startDate && <p className="text-xs text-error-500 mt-1">{errors.startDate}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Супервайзер *</label>
              <input
                className={`input ${errors.supervisor ? 'border-error-500' : ''}`}
                placeholder="Фамилия И.О."
                value={form.supervisor}
                onChange={e => set('supervisor', e.target.value)}
              />
              {errors.supervisor && <p className="text-xs text-error-500 mt-1">{errors.supervisor}</p>}
            </div>
          </div>

          {/* Status preview */}
          <div className="bg-primary-50 rounded-lg p-3 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-info-500" />
            <div>
              <p className="text-xs text-gray-500">Начальный статус</p>
              <p className="text-sm font-semibold text-primary-900">Бурение</p>
            </div>
          </div>
        </div>

        {/* Modal footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex gap-3 justify-end">
          <Button variant="ghost" onClick={onClose}>Отмена</Button>
          <Button variant="primary" onClick={handleSave}>Создать скважину</Button>
        </div>
      </motion.div>
    </div>
  )
}

// ─────────────────────────────── Main Page ─────────────────────────────────
export default function WellsList() {
  const [wells, setWells] = useState<Well[]>(WELLS_DATA)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [fieldFilter, setFieldFilter] = useState('')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [showModal, setShowModal] = useState(false)
  const [newWellSuccess, setNewWellSuccess] = useState('')

  const filtered = wells.filter(w => {
    const q = search.toLowerCase()
    const matchSearch = !search || w.number.includes(search) || w.field.toLowerCase().includes(q) || w.contractor.toLowerCase().includes(q) || w.license.toLowerCase().includes(q) || w.supervisor.toLowerCase().includes(q)
    return matchSearch && (!statusFilter || w.status === statusFilter) && (!fieldFilter || w.field === fieldFilter)
  })

  const stats = {
    total: wells.length,
    drilling: wells.filter(w => w.status === 'drilling').length,
    testing: wells.filter(w => w.status === 'testing').length,
    production: wells.filter(w => w.status === 'production').length,
    issues: wells.filter(w => w.overdueDocs > 0 || w.status === 'suspended').length,
  }

  const handleSaveWell = (w: Well) => {
    setWells(prev => [w, ...prev])
    setShowModal(false)
    setNewWellSuccess(`Скважина №${w.number} добавлена!`)
    setTimeout(() => setNewWellSuccess(''), 3000)
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">🏗️ Скважины</h1>
          <p className="text-sm text-gray-500 mt-0.5">Фонд: {stats.total} скважин</p>
        </div>
        <div className="flex items-center gap-2">
          {newWellSuccess && (
            <motion.span
              initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
              className="text-sm text-success-500 font-medium"
            >
              ✅ {newWellSuccess}
            </motion.span>
          )}
          <Button variant="primary" onClick={() => setShowModal(true)}>+ Новая скважина</Button>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'Всего',        value: stats.total,      color: 'text-gray-800',      bg: 'bg-white' },
          { label: 'Бурение',      value: stats.drilling,   color: 'text-info-500',      bg: 'bg-blue-50' },
          { label: 'Испытание',    value: stats.testing,    color: 'text-warning-500',   bg: 'bg-amber-50' },
          { label: 'Добыча',       value: stats.production, color: 'text-success-500',   bg: 'bg-green-50' },
          { label: 'Проблемы',     value: stats.issues,     color: 'text-error-500',     bg: 'bg-red-50' },
        ].map(s => (
          <button
            key={s.label}
            onClick={() => {
              if (s.label === 'Бурение') setStatusFilter(f => f === 'drilling' ? '' : 'drilling')
              else if (s.label === 'Испытание') setStatusFilter(f => f === 'testing' ? '' : 'testing')
              else if (s.label === 'Добыча') setStatusFilter(f => f === 'production' ? '' : 'production')
              else setStatusFilter('')
            }}
            className={`${s.bg} border border-gray-200 rounded-lg p-3 text-center hover:shadow-sm transition-all cursor-pointer`}
          >
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
          </button>
        ))}
      </div>

      {/* Filters + view toggle */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <Input placeholder="🔍 Поиск по номеру, месторождению, подрядчику..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input sm:w-44" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select className="input sm:w-40" value={fieldFilter} onChange={e => setFieldFilter(e.target.value)}>
          <option value="">Все месторождения</option>
          {FIELDS.filter(Boolean).map(f => <option key={f} value={f}>{f}</option>)}
        </select>
        {/* View toggle */}
        <div className="flex border border-gray-200 rounded-md overflow-hidden">
          <button onClick={() => setViewMode('table')} className={`px-3 py-2 text-sm transition-colors ${viewMode === 'table' ? 'bg-primary-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`} title="Список">≡</button>
          <button onClick={() => setViewMode('grid')} className={`px-3 py-2 text-sm transition-colors ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`} title="Карточки">⊞</button>
        </div>
      </div>

      {/* COUNT */}
      <p className="text-xs text-gray-400">Показано {filtered.length} из {wells.length}</p>

      {/* ─── TABLE VIEW ─── */}
      {viewMode === 'table' && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                <th className="text-left px-4 py-3 font-semibold">Скважина</th>
                <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Месторождение</th>
                <th className="text-left px-4 py-3 font-semibold">Статус</th>
                <th className="text-left px-4 py-3 font-semibold hidden lg:table-cell">Глубина</th>
                <th className="text-left px-4 py-3 font-semibold hidden xl:table-cell">Подрядчик</th>
                <th className="text-left px-4 py-3 font-semibold hidden lg:table-cell">Прогресс</th>
                <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Документы</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((well, i) => {
                const cfg = statusConfig[well.status]
                return (
                  <motion.tr
                    key={well.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors group"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />
                        <div>
                          <p className="font-bold text-gray-900">№{well.number}</p>
                          <p className="text-xs text-gray-400">{well.license}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="text-gray-700 font-medium">{well.field}</p>
                      <p className="text-xs text-gray-400">{well.startDate}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={cfg.variant}>{cfg.label}</Badge>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-gray-700 font-mono text-xs">
                      {well.currentDepth.toLocaleString()} / {well.designDepth.toLocaleString()} м
                    </td>
                    <td className="px-4 py-3 hidden xl:table-cell max-w-[160px]">
                      <p className="truncate text-gray-700">{well.contractor}</p>
                      <p className="text-xs text-gray-400 truncate">{well.supervisor}</p>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell w-36">
                      {well.status !== 'completed' && well.status !== 'production' ? (
                        <div>
                          <ProgressBar value={well.progress} size="sm" showLabel={false}
                            color={well.status === 'testing' ? 'warning' : well.status === 'suspended' ? 'error' : 'primary'} />
                          <p className="text-xs text-gray-400 mt-1">{well.progress}%</p>
                        </div>
                      ) : (
                        <span className="text-xs text-success-500 font-medium">✅ 100%</span>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {well.overdueDocs > 0
                        ? <span className="text-xs text-error-500 font-medium bg-red-50 px-2 py-0.5 rounded-full">⚠️ {well.overdueDocs} просроч.</span>
                        : <span className="text-xs text-success-500 font-medium">✅ {well.criticalDocs} в порядке</span>
                      }
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link to={`/wells/${well.id}`}>
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-primary-500 font-medium hover:underline whitespace-nowrap">
                          Открыть →
                        </button>
                      </Link>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-16 text-center text-gray-400">
              <p className="text-3xl mb-2">🔍</p>
              <p className="font-medium">Скважины не найдены</p>
            </div>
          )}
        </div>
      )}

      {/* ─── GRID VIEW ─── */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((well, i) => {
            const cfg = statusConfig[well.status]
            return (
              <motion.div key={well.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all hover:-translate-y-0.5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
                      <h3 className="font-bold text-gray-900">Скв. №{well.number}</h3>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 ml-4">{well.field} · {well.license}</p>
                  </div>
                  <Badge variant={cfg.variant}>{cfg.label}</Badge>
                </div>

                {well.status !== 'production' && well.status !== 'completed' && (
                  <div className="mb-3">
                    <ProgressBar value={well.progress} size="sm" showLabel={false}
                      color={well.status === 'testing' ? 'warning' : well.status === 'suspended' ? 'error' : 'primary'} />
                    <p className="text-xs text-gray-400 mt-1">{well.progress}% · {well.currentDepth.toLocaleString()}/{well.designDepth.toLocaleString()} м</p>
                  </div>
                )}

                <div className="text-xs space-y-1 border-t border-gray-100 pt-3 text-gray-600">
                  <div className="flex justify-between"><span>Подрядчик</span><span className="font-medium truncate max-w-[140px]">{well.contractor}</span></div>
                  <div className="flex justify-between"><span>Супервайзер</span><span className="font-medium">{well.supervisor}</span></div>
                  <div className="flex justify-between"><span>Начало</span><span className="font-medium">{well.startDate}</span></div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                  {well.overdueDocs > 0
                    ? <span className="text-xs text-error-500 font-medium">⚠️ {well.overdueDocs} просрочено</span>
                    : <span className="text-xs text-success-500 font-medium">✅ Docs OK</span>
                  }
                  <Link to={`/wells/${well.id}`}>
                    <Button variant="primary" size="sm">Детали</Button>
                  </Link>
                </div>
              </motion.div>
            )
          })}
          {filtered.length === 0 && (
            <div className="col-span-3 py-16 text-center text-gray-400">
              <p className="text-3xl mb-2">🔍</p><p className="font-medium">Скважины не найдены</p>
            </div>
          )}
        </div>
      )}

      {/* New Well Modal */}
      <AnimatePresence>
        {showModal && <NewWellModal onClose={() => setShowModal(false)} onSave={handleSaveWell} />}
      </AnimatePresence>
    </div>
  )
}

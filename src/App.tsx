import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  CheckCircle2,
  FileText,
  Download,
  Send,
  Sparkles,
  Paperclip,
  ChevronRight,
  Info,
  X,
  RefreshCw,
  Eye,
  Award,
  Trash2,
  Database
} from 'lucide-react';

// ==========================================
// 1. DATA DEFINITIONS (13 Modules & Scenarios)
// ==========================================

interface AttachedFile {
  name: string;
  size: string;
  type: 'csv' | 'xlsx';
  description: string;
  sampleHeaders: string[];
  sampleRows: (string | number | boolean | null)[][];
}

interface ScenarioItem {
  id: string;
  code: string;
  title: string;
  keyword: string;
  scenario: string;
  files: AttachedFile[];
}

interface ModuleCategory {
  id: number;
  name: string;
  englishName: string;
  items: ScenarioItem[];
}

const MODULES_DATA: ModuleCategory[] = [
  {
    id: 1,
    name: '기술통계',
    englishName: 'Descriptive Statistics',
    items: [
      {
        id: '1-1',
        code: '1-1',
        title: '데이터의 이해와 척도',
        keyword: '측정 척도 (Measurement Scale)',
        scenario: '스마트팩토리 가공 라인에서 설비 센서로부터 수집되는 데이터(온도, 진동 등 연속형)와 작업자 육안 검사 결과(양품/불량 등 명목형), 그리고 제품 외관 품질 등급(A/B/C 등 서열형)이 혼재되어 있습니다. 현재 공정 엔지니어들은 서열 척도인 불량 등급 데이터를 단순 산술 평균하여 보고서에 반영하는 오류를 범하고 있으며, 등간/비율 척도 센서 데이터와의 결합 분석 시 척도의 특성을 무시한 전처리를 진행하고 있습니다. 데이터의 본질적 특성을 무시한 분석으로 인해 잘못된 공정 의사결정이 발생하고 있는 현 상황에서, 각 데이터 유형의 측정 척도를 올바르게 재정의하고 척도에 부합하는 통계 분석 기준 및 지표 체계를 수립하시오.',
        files: [
          {
            name: 'Line_Sensors_Raw.csv',
            size: '2.4 MB',
            type: 'csv',
            description: '설비 센서 연속형 및 명목형 데이터',
            sampleHeaders: ['Lot_ID', 'Temp_C', 'Vibration_mm', 'Status_Flag', 'Quality_Grade'],
            sampleRows: [
              ['LOT-001', 78.4, 0.42, 'Normal', 'A'],
              ['LOT-002', 82.1, 0.58, 'Warning', 'B'],
              ['LOT-003', 95.3, 1.24, 'Defect', 'C'],
              ['LOT-004', 77.9, 0.39, 'Normal', 'A'],
              ['LOT-005', 84.6, 0.71, 'Normal', 'B']
            ]
          },
          {
            name: 'Scale_Definition_Guide.xlsx',
            size: '1.1 MB',
            type: 'xlsx',
            description: '공정 내 수집 변수별 척도 정의 명세서',
            sampleHeaders: ['Variable', 'Field_Type', 'Measurement_Scale', 'Valid_Stats'],
            sampleRows: [
              ['Temp_C', 'Float', 'Interval/Ratio', 'Mean, StdDev'],
              ['Status_Flag', 'String', 'Nominal', 'Mode, Frequency'],
              ['Quality_Grade', 'String', 'Ordinal', 'Median, IQR']
            ]
          },
          {
            name: 'Inspection_Grade_Summary.csv',
            size: '850 KB',
            type: 'csv',
            description: '작업조별 외관 등급 판정 실적치',
            sampleHeaders: ['Shift', 'Grade_A_Count', 'Grade_B_Count', 'Grade_C_Count'],
            sampleRows: [
              ['Day', 1420, 310, 45],
              ['Night', 1280, 420, 92]
            ]
          }
        ]
      },
      {
        id: '1-2',
        code: '1-2',
        title: '중심경향치와 산포도',
        keyword: '분산 (Variance)',
        scenario: '2차전지 전극 코팅 공정의 슬러리 두께 측정 데이터에서 두 개 라인의 평균 두께는 모두 목표 스펙(100.0㎛)에 근접해 합격 수준으로 보이지만, B라인의 경우 조립 후 셀 용량 불균일 클레임이 급증하고 있습니다. 데이터 상세 분석 결과 평균값은 동일하나 B라인의 분산과 표준편차가 A라인 대비 3.5배 이상 크게 발생하며 극단치들이 빈번히 관측되고 있습니다. 중심경향치(평균)에만 의존한 공정 모니터링 체계의 한계를 규명하고, 분산 및 사분위수 범위를 활용해 공정의 산포를 정량화하며 산포 확대를 유발하는 근본 원인을 파악하기 위한 관리 지표를 도출하시오.',
        files: [
          {
            name: 'Coating_Thickness_A_B.csv',
            size: '3.1 MB',
            type: 'csv',
            description: '코팅 A/B 라인 두께 연속 측정치',
            sampleHeaders: ['Timestamp', 'Line', 'Thickness_um', 'Target_um'],
            sampleRows: [
              ['2026-10-01 08:00', 'Line_A', 100.2, 100.0],
              ['2026-10-01 08:01', 'Line_B', 104.8, 100.0],
              ['2026-10-01 08:02', 'Line_B', 94.2, 100.0]
            ]
          },
          {
            name: 'Dispersion_Metrics_Summary.xlsx',
            size: '640 KB',
            type: 'xlsx',
            description: '라인별 분산, 왜도, 변동계수(CV) 요약',
            sampleHeaders: ['Line', 'Mean', 'Variance', 'StdDev', 'CV(%)'],
            sampleRows: [
              ['Line_A', 100.12, 1.84, 1.35, 1.35],
              ['Line_B', 100.28, 6.45, 2.54, 2.53]
            ]
          },
          {
            name: 'Slurry_Viscosity_Log.csv',
            size: '1.4 MB',
            type: 'csv',
            description: '슬러리 점도 및 투입 온도 이력',
            sampleHeaders: ['Batch_No', 'Viscosity_cP', 'Mixer_RPM', 'Temp_C'],
            sampleRows: [
              ['B-901', 3200, 450, 24.5],
              ['B-902', 4100, 430, 28.1]
            ]
          }
        ]
      },
      {
        id: '1-3',
        code: '1-3',
        title: '데이터의 분포와 형태',
        keyword: '정규분포 (Normal Distribution)',
        scenario: '정밀 베어링 내경 가공 공정에서 표준 통계적 기법을 적용해 관리한계선을 산정해왔으나, 최근 가공 치수 분포가 정규성을 만족하지 못하고 우측으로 긴 꼬리를 갖는 왜도(Skewness)와 쌍봉형(Bimodal) 형태를 띠고 있음이 발견되었습니다. 정규분포 가정이 깨진 상태에서 모수적 관리 기준을 그대로 적용함에 따라 오경보(False Alarm)가 일일 수십 회 발생하고 실제 이상은 감지하지 못하고 있습니다. 샤피로-윌크(Shapiro-Wilk) 검정 등을 통해 정규성을 검증하고, 비정규 분포 발생 원인을 공정 인자 관점에서 해석한 뒤 분포 변환(Box-Cox 등) 또는 비모수적 접근 전략을 제시하시오.',
        files: [
          {
            name: 'Bearing_Inner_Diameter.csv',
            size: '1.9 MB',
            type: 'csv',
            description: '베어링 내경 가공 실측 치수 데이터',
            sampleHeaders: ['Part_ID', 'Diameter_mm', 'Tool_Life_Hours', 'Spindle_Load'],
            sampleRows: [
              ['P-1001', 25.012, 12.5, 42.1],
              ['P-1002', 25.045, 114.2, 58.7],
              ['P-1003', 25.018, 24.0, 43.0]
            ]
          },
          {
            name: 'Normality_Test_Results.xlsx',
            size: '520 KB',
            type: 'xlsx',
            description: '정규성 검정 및 왜도/첨도 평가표',
            sampleHeaders: ['Test_Method', 'P_Value', 'Skewness', 'Kurtosis', 'Decision'],
            sampleRows: [
              ['Shapiro-Wilk', 0.0012, 1.84, 4.21, 'Reject H0 (Non-normal)'],
              ['Anderson-Darling', 0.0008, 1.84, 4.21, 'Reject H0']
            ]
          },
          {
            name: 'Tool_Wear_Distribution.csv',
            size: '980 KB',
            type: 'csv',
            description: '가공 툴 마모도 및 마모 주기별 치수 분포',
            sampleHeaders: ['Tool_Cycle', 'Wear_Amount_um', 'Bimodal_Group'],
            sampleRows: [
              ['Cycle_1', 1.2, 'Group_A'],
              ['Cycle_2', 8.9, 'Group_B']
            ]
          }
        ]
      },
      {
        id: '1-4',
        code: '1-4',
        title: '시각화 기법',
        keyword: '패턴 인식 (Pattern Recognition)',
        scenario: '반도체 패키징 검사 장비에서 시간당 수천 건의 와이어 본딩 불량 로그가 발생하고 있으나, 수치 테이블 형태의 보고서로는 반복되는 결함의 주기성과 위치적 군집 패턴을 신속하게 식별하기 어렵습니다. 히스토그램, 산점도 매트릭스, 열화도 히트맵 및 시계열 트렌드 차트를 적용하여 설비 가열 주기와 와이어 텐션 저하 간의 상관 패턴을 시각적으로 가시화하고자 합니다. 단순 수치 나열을 넘어 엔지니어가 한눈에 이상 징후 패턴을 판독(Pattern Recognition)할 수 있는 탐색적 시각화 대시보드 설계 및 패턴 기반 원인 추정안을 마련하시오.',
        files: [
          {
            name: 'Wire_Bonding_Telemetry.csv',
            size: '4.2 MB',
            type: 'csv',
            description: '초당 와이어 본더 본딩 강도 및 온도 시계열',
            sampleHeaders: ['Timestamp', 'Die_X', 'Die_Y', 'Bond_Strength_gf', 'Temp_C'],
            sampleRows: [
              ['2026-10-12 10:00:01', 12.4, 45.1, 8.4, 185.2],
              ['2026-10-12 10:00:02', 12.5, 45.2, 5.1, 198.6]
            ]
          },
          {
            name: 'Defect_Spatial_Coordinates.xlsx',
            size: '1.5 MB',
            type: 'xlsx',
            description: '웨이퍼/패키지 결함 위치 좌표 맵핑 데이터',
            sampleHeaders: ['Wafer_ID', 'Defect_Type', 'Pos_X', 'Pos_Y', 'Cluster_ID'],
            sampleRows: [
              ['W-77', 'Lifted_Lead', 140, 220, 'Cluster_3'],
              ['W-77', 'Cracked_Ball', 142, 224, 'Cluster_3']
            ]
          },
          {
            name: 'Pattern_Classification_Guide.csv',
            size: '720 KB',
            type: 'csv',
            description: '시계열 주기적 결함 및 핫스팟 패턴 표준',
            sampleHeaders: ['Pattern_Name', 'Visual_Signature', 'Likely_Root_Cause'],
            sampleRows: [
              ['Cyclic_Thermal', 'Sinusoidal Drift', 'Heater Relay Malfunction'],
              ['Corner_Concentration', 'Periphery Hotspot', 'Pressure Imbalance']
            ]
          }
        ]
      },
      {
        id: '1-5',
        code: '1-5',
        title: '이상치 탐지 및 데이터 요약',
        keyword: '결측치 (Missing Value)',
        scenario: '정유 화학 플랜트의 반응기 압력 및 촉매 온도 센서 네트워크에서 간헐적인 통신 노이즈로 인해 결측치(NaN/Null)가 전체 수집 데이터의 8.4% 수준으로 발생하고 있습니다. 현장 담당자가 이를 단순 평균값으로 일괄 대치(Imputation)하거나 행을 무조건 삭제하여, 비정상 고압 스파이크 직전의 징후 신호가 유실되는 위험이 초래되었습니다. IQR 기반 이상치 탐지와 결측치 발생 메커니즘(MCAR, MAR, MNAR)을 분석하고, 시계열 보간법(Spline, 선형)과 KNN 대치법을 비교 평가하여 공정의 안전 임계치 왜곡 없는 강건한 데이터 요약 체계를 구현하시오.',
        files: [
          {
            name: 'Reactor_Sensors_Raw_Missing.csv',
            size: '3.8 MB',
            type: 'csv',
            description: '결측치 및 센서 스파이크가 포함된 원시 시계열',
            sampleHeaders: ['Time', 'Reactor_Pressure_bar', 'Catalyst_Temp_C', 'Flow_Rate'],
            sampleRows: [
              ['00:00:10', 42.1, 310.2, 120.4],
              ['00:00:20', null, 310.5, 120.6],
              ['00:00:30', 98.4, null, 121.0]
            ]
          },
          {
            name: 'Imputation_Comparison_Test.xlsx',
            size: '1.2 MB',
            type: 'xlsx',
            description: '단순 대치, 선형보간, KNN 대치 성능 비교',
            sampleHeaders: ['Method', 'RMSE', 'MAE', 'Variance_Distortion_Rate'],
            sampleRows: [
              ['Mean_Impute', 4.82, 3.41, '+18.2%'],
              ['KNN_K5', 1.15, 0.82, '+1.4%']
            ]
          },
          {
            name: 'Outlier_IQR_Thresholds.csv',
            size: '540 KB',
            type: 'csv',
            description: '공정 변수별 Q1, Q3 및 IQR 이상치 판별 기준치',
            sampleHeaders: ['Sensor', 'Q1', 'Q3', 'IQR', 'Lower_Bound', 'Upper_Bound'],
            sampleRows: [
              ['Pressure', 38.5, 44.2, 5.7, 29.95, 52.75]
            ]
          }
        ]
      }
    ]
  },
  {
    id: 2,
    name: '추론통계',
    englishName: 'Inferential Statistics',
    items: [
      {
        id: '2-1',
        code: '2-1',
        title: '확률분포와 표본추출',
        keyword: '중심극한정리 (CLT)',
        scenario: '물류 이커머스 풀필먼트 센터에서 일일 수십만 건의 출고 리드타임 분포는 심각하게 우측으로 왜곡된 지수분포 형태를 띠고 있습니다. 센터 운영팀은 모평균 추정을 위해 10건 미만의 소표본만을 추출하여 일일 KPI를 산정하고 있어 추정치의 신뢰도가 급격히 흔들리고 있습니다. 표본의 크기(n)를 점진적으로 증가시키며 표본평균들의 분포가 중심극한정리(CLT)에 따라 정규분포에 수렴하는 현상을 검증하고, 모평균을 95% 신뢰수준에서 오차범위 5분 이내로 추정하기 위한 최소 필요 표본 크기를 수리적으로 산출하시오.',
        files: [
          {
            name: 'Fulfillment_Leadtime_Population.csv',
            size: '4.8 MB',
            type: 'csv',
            description: '모집단 10만 건 출고 소요시간 데이터',
            sampleHeaders: ['Order_No', 'Pick_Time_min', 'Pack_Time_min', 'Total_Leadtime'],
            sampleRows: [
              ['ORD-101', 14.2, 5.1, 19.3],
              ['ORD-102', 45.8, 12.0, 57.8]
            ]
          },
          {
            name: 'Sampling_Simulation_CLT.xlsx',
            size: '2.1 MB',
            type: 'xlsx',
            description: 'n=5, 30, 100 표본 추출 시뮬레이션 결과',
            sampleHeaders: ['Sample_Size_N', 'Iteration', 'Sample_Mean', 'Sample_Std'],
            sampleRows: [
              [5, 1, 32.4, 18.2],
              [30, 1, 26.8, 4.3],
              [100, 1, 25.1, 2.1]
            ]
          },
          {
            name: 'Sample_Size_Formula_Guide.csv',
            size: '340 KB',
            type: 'csv',
            description: '신뢰구간별 최소 표본 크기 산출 공식 및 계수',
            sampleHeaders: ['Confidence_Level', 'Z_Value', 'Margin_of_Error', 'Required_N'],
            sampleRows: [
              ['95%', 1.96, 5.0, 246],
              ['99%', 2.576, 5.0, 425]
            ]
          }
        ]
      },
      {
        id: '2-2',
        code: '2-2',
        title: '가설검정의 원리',
        keyword: '유의확률 (p-value)',
        scenario: '신규 촉매제를 투입한 화학 반응 공정의 수율이 기존 88.5%에서 89.2%로 소폭 상승하였으나, 이를 도입할지 여부를 두고 개발팀과 생산본부 간에 치열한 논쟁이 벌어지고 있습니다. 귀무가설(기존 촉매와 차이가 없다)과 대립가설을 명확히 설정하고 유의수준 α=0.05 기준에서 계산된 검정통계량과 p-value를 도출해야 합니다. 계산된 p-value(0.038)의 통계적 의미(귀무가설이 참일 때 이 이상의 극단적 결과가 나올 확률)를 정확히 해석하고, 1종 오류 및 2종 오류의 경영상 리스크를 고려한 도입 타당성 의사결정 보고서를 작성하시오.',
        files: [
          {
            name: 'Catalyst_Yield_Experiment.csv',
            size: '1.2 MB',
            type: 'csv',
            description: '기존 촉매군 vs 신규 촉매군 배치별 수율 데이터',
            sampleHeaders: ['Batch_ID', 'Catalyst_Type', 'Yield_Percent', 'Reaction_Temp'],
            sampleRows: [
              ['B-01', 'Standard', 88.4, 175.0],
              ['B-02', 'New_Formula', 89.6, 174.8]
            ]
          },
          {
            name: 'Hypothesis_Test_Report.xlsx',
            size: '760 KB',
            type: 'xlsx',
            description: 't-검정 통계량, p-value 및 기각역 분석표',
            sampleHeaders: ['Null_Hypothesis', 'T_Statistic', 'P_Value', 'Alpha', 'Result'],
            sampleRows: [
              ['Mean_New <= Mean_Std', 2.115, 0.038, 0.05, 'Reject H0']
            ]
          },
          {
            name: 'Error_Risk_Evaluation.csv',
            size: '420 KB',
            type: 'csv',
            description: '제1종 오류(α)와 제2종 오류(β) 비용 영향도 분석',
            sampleHeaders: ['Error_Type', 'Definition', 'Financial_Impact_KRW', 'Mitigation'],
            sampleRows: [
              ['Type_I', 'False Positive (효과없는데 도입)', '350,000,000', '유의수준 0.01 강화'],
              ['Type_II', 'False Negative (효과있는데 기각)', '120,000,000', '검정력(1-β) 0.8 확보']
            ]
          }
        ]
      },
      {
        id: '2-3',
        code: '2-3',
        title: '평균 검정 (t-test 및 ANOVA)',
        keyword: '집단 간 평균 차이 (Difference of Means)',
        scenario: '자동차 엔진 피스톤을 생산하는 4개 외주 가공업체(Vendor A, B, C, D) 제품의 인장강도 시험 결과에서 업체 간 품질 편차가 심하다는 고객 피로도가 접수되었습니다. 단순 2개사 간 t-test를 반복할 경우 다중검정의 문제(제1종 오류의 누적)가 발생하므로, 일원배치 분산분석(One-way ANOVA)을 수행하여 4개 공급사 간 평균 차이의 유의성을 검정해야 합니다. 분산분석 결과 F-통계량의 유의성이 확인된 후 터키(Tukey HSD) 사후검정(Post-hoc)을 통해 구체적으로 어떤 업체가 열위한지 규명하고 공급망 품질 개선 대책을 도출하시오.',
        files: [
          {
            name: 'Vendor_Tensile_Strength.csv',
            size: '2.3 MB',
            type: 'csv',
            description: '4개 외주사 피스톤 인장강도(MPa) 측정 원천 데이터',
            sampleHeaders: ['Sample_ID', 'Vendor', 'Tensile_Strength_MPa', 'Hardness_HV'],
            sampleRows: [
              ['S-001', 'Vendor_A', 412.5, 128.0],
              ['S-002', 'Vendor_B', 438.1, 134.2],
              ['S-003', 'Vendor_C', 389.4, 118.5],
              ['S-004', 'Vendor_D', 415.0, 129.1]
            ]
          },
          {
            name: 'ANOVA_Table_Summary.xlsx',
            size: '610 KB',
            type: 'xlsx',
            description: '집단 간 제곱합(SSB), 집단 내 제곱합(SSW) 분산분석표',
            sampleHeaders: ['Source', 'DF', 'Sum_of_Squares', 'Mean_Square', 'F_Value', 'P_Value'],
            sampleRows: [
              ['Between_Groups', 3, 2450.8, 816.93, 14.62, 0.0001],
              ['Within_Groups', 116, 6480.2, 55.86, null, null]
            ]
          },
          {
            name: 'Tukey_HSD_PostHoc.csv',
            size: '480 KB',
            type: 'csv',
            description: '쌍별 사후검정 p-value 및 평균차 95% 신뢰구간',
            sampleHeaders: ['Comparison', 'Diff_Means', 'Lower_CI', 'Upper_CI', 'Adj_P_Value'],
            sampleRows: [
              ['Vendor_B - Vendor_C', 48.7, 32.1, 65.3, 0.00001],
              ['Vendor_A - Vendor_D', -2.5, -15.4, 10.4, 0.9412]
            ]
          }
        ]
      },
      {
        id: '2-4',
        code: '2-4',
        title: '분산 및 비율 검정',
        keyword: '동질성 (Homogeneity)',
        scenario: '주간조와 야간조 두 작업조 간의 납땜 공정 불량률(수율 불량 비율)과 가공 공차 분산이 동일한지 검증하려 합니다. 두 집단의 분산 동질성을 검정하는 바틀렛(Bartlett) 또는 레빈(Levene) 등분산 검정을 먼저 선행하여 독립표본 t-검정의 가정 충족 여부를 확인하고, 두 작업조의 불량 발생 건수에 대해 2-비율 Z검정(2-Proportion Test) 및 카이제곱 독립성 검정을 수행하여 작업조 간 품질 관리 편차(동질성 위배)를 통계적으로 입증하시오.',
        files: [
          {
            name: 'Shift_Defect_Proportions.csv',
            size: '1.6 MB',
            type: 'csv',
            description: '주간조/야간조 생산 수량 및 불량 판정 건수',
            sampleHeaders: ['Date', 'Shift', 'Total_Units', 'Defect_Count', 'Defect_Rate'],
            sampleRows: [
              ['2026-10-01', 'Day', 12000, 144, 0.012],
              ['2026-10-01', 'Night', 11500, 218, 0.019]
            ]
          },
          {
            name: 'Levene_Variance_Test.xlsx',
            size: '590 KB',
            type: 'xlsx',
            description: '작업조 간 치수 분산 동질성 검정 분석표',
            sampleHeaders: ['Variable', 'Levene_Statistic', 'P_Value', 'Equal_Variance'],
            sampleRows: [
              ['Tolerance_Deviation', 4.92, 0.027, 'Rejected (Heterogeneous)']
            ]
          },
          {
            name: 'Two_Proportion_Test_Result.csv',
            size: '410 KB',
            type: 'csv',
            description: '2-비율 Z 검정 통계량 및 교차분할표',
            sampleHeaders: ['Group_1_Rate', 'Group_2_Rate', 'Z_Stat', 'P_Value', 'Diff_CI_95'],
            sampleRows: [
              [0.012, 0.019, -4.12, 0.00004, '[-0.010, -0.004]']
            ]
          }
        ]
      },
      {
        id: '2-5',
        code: '2-5',
        title: '상관 및 단순 회귀분석 기초',
        keyword: '상관계수 (Correlation Coefficient)',
        scenario: '사출 성형 제품의 수축률과 금형 냉각 시간 사이의 인과관계를 밝히고자 100회 배치 실험 데이터를 수집했습니다. 피어슨 상관계수(r)가 -0.84로 강한 음의 선형 상관을 보이고 있으나, 냉각 시간이 25초를 초과하는 구간에서는 비선형적 포화 현상이 나타나 단순 선형회귀 모델의 잔차(Residual)가 뚜렷한 곡선 패턴을 보이고 있습니다. 상관계수의 크기 해석에 그치지 않고 회귀식의 결정계수(R²), 잔차의 독립성/등분산성 진단을 통해 모형 적합성을 비판적으로 검토하고 최적 냉각 시간을 도출하시오.',
        files: [
          {
            name: 'Molding_Cooling_Shrinkage.csv',
            size: '1.4 MB',
            type: 'csv',
            description: '금형 냉각 시간(초)과 제품 수축률(%) 측정치',
            sampleHeaders: ['Batch_No', 'Cooling_Time_sec', 'Shrinkage_Percent', 'Mold_Temp'],
            sampleRows: [
              ['M-101', 15.0, 1.82, 65.4],
              ['M-102', 20.0, 1.45, 65.1],
              ['M-103', 25.0, 1.18, 65.0],
              ['M-104', 30.0, 1.15, 65.2]
            ]
          },
          {
            name: 'Linear_Regression_Summary.xlsx',
            size: '670 KB',
            type: 'xlsx',
            description: '회귀계수, R-Squared, F값 및 잔차 분석표',
            sampleHeaders: ['R_Squared', 'Adj_R_Squared', 'Slope', 'Intercept', 'P_Value'],
            sampleRows: [
              [0.7056, 0.7025, -0.038, 2.24, 0.00001]
            ]
          },
          {
            name: 'Residual_Diagnostics.csv',
            size: '510 KB',
            type: 'csv',
            description: '예측치 대 잔차값 및 정규 Q-Q 플롯 데이터',
            sampleHeaders: ['Obs', 'Actual', 'Predicted', 'Residual', 'Std_Residual'],
            sampleRows: [
              [1, 1.82, 1.67, 0.15, 1.21],
              [2, 1.15, 1.10, 0.05, 0.40]
            ]
          }
        ]
      }
    ]
  },
  {
    id: 3,
    name: '실험계획법',
    englishName: 'Design of Experiments (DOE)',
    items: [
      {
        id: '3-1',
        code: '3-1',
        title: '실험계획법의 기본 원리',
        keyword: '랜덤화 (Randomization)',
        scenario: '신형 태양광 패널의 열처리 공정 수율 향상을 위해 온도(3수준)와 압력(3수준) 요인을 검증하는 실험을 진행하고 있습니다. 그러나 실험자가 편의를 위해 온도를 저온에서 고온 순서로 순차 배치하여 실험을 진행함에 따라, 시간 경과에 따른 챔버 내 카본 잔여물 축적이라는 외생 변수(Lurking Variable)가 온도 효과와 심각하게 교락되었습니다. 실험 계획의 3대 원리인 랜덤화(Randomization), 반복(Replication), 블록화(Blocking)를 적용하여 외생 변수의 편향을 통제할 수 있는 재실험 배치표를 설계하시오.',
        files: [
          {
            name: 'Thermal_Process_DOE_Plan.csv',
            size: '1.1 MB',
            type: 'csv',
            description: '온도/압력 3수준 실험 배치표 및 측정 결과',
            sampleHeaders: ['Run_Order', 'Temp_Level', 'Pressure_Level', 'Chamber_Time', 'Yield'],
            sampleRows: [
              [1, 150, 1.0, 'Day1_AM', 84.2],
              [2, 150, 2.0, 'Day1_PM', 85.1],
              [3, 200, 1.0, 'Day2_AM', 88.0]
            ]
          },
          {
            name: 'Randomization_Seed_Table.xlsx',
            size: '480 KB',
            type: 'xlsx',
            description: '난수표 기반 무작위 실험 런 순서 매핑표',
            sampleHeaders: ['Standard_Order', 'Random_Run_Order', 'Factor_A', 'Factor_B'],
            sampleRows: [
              [1, 6, -1, -1],
              [2, 2, 1, -1],
              [3, 9, -1, 1]
            ]
          },
          {
            name: 'Nuisance_Variable_Analysis.csv',
            size: '590 KB',
            type: 'csv',
            description: '실험 시간 경과에 따른 챔버 카본 잔여도 모니터링',
            sampleHeaders: ['Hour', 'Carbon_Deposit_ppm', 'Drift_Bias_Yield'],
            sampleRows: [
              [1, 12, 0.0],
              [24, 85, -2.4]
            ]
          }
        ]
      },
      {
        id: '3-2',
        code: '3-2',
        title: '일원 및 이원 실험계획',
        keyword: '주효과 (Main Effect)',
        scenario: '식품 제조 공정에서 스낵 제품의 바삭함(경도 지수)에 영향을 주는 주원료 배합비(요인 A)와 유탕 온도(요인 B)의 효과를 파악하기 위해 2원 배치 실험을 수행했습니다. 분석 결과 주원료 배합비의 변화에 따른 주효과(Main Effect)는 통계적으로 유의미한 것으로 나타났으나, 유탕 온도의 주효과는 단독으로는 유의수준 5%를 벗어나는 것으로 계산되었습니다. 주효과 플롯(Main Effects Plot)을 통해 수준별 평균 반응의 기울기를 평가하고, 각 요인이 목적 반응값에 미치는 기여율을 정량 분해하시오.',
        files: [
          {
            name: 'Two_Way_ANOVA_Data.csv',
            size: '1.5 MB',
            type: 'csv',
            description: '배합비(3수준) x 튀김온도(3수준) 반복 3회 경도 시험치',
            sampleHeaders: ['Ingredient_Ratio', 'Fry_Temp', 'Replicate', 'Crispiness_Score'],
            sampleRows: [
              ['Ratio_1', 160, 1, 45.2],
              ['Ratio_1', 170, 1, 52.1],
              ['Ratio_2', 160, 1, 68.4]
            ]
          },
          {
            name: 'Main_Effect_Calculations.xlsx',
            size: '530 KB',
            type: 'xlsx',
            description: '요인별 수준 평균값 및 주효과 변동 크기 산출표',
            sampleHeaders: ['Factor', 'Level_1_Mean', 'Level_2_Mean', 'Delta', 'P_Value'],
            sampleRows: [
              ['Ingredient_Ratio', 48.5, 72.1, 23.6, 0.0002],
              ['Fry_Temp', 58.2, 62.4, 4.2, 0.1240]
            ]
          },
          {
            name: 'Texture_Sensory_Log.csv',
            size: '720 KB',
            type: 'csv',
            description: '패널 관능평가 연계 수분함량 및 텍스처 데이터',
            sampleHeaders: ['Sample_ID', 'Moisture_Pct', 'Breaking_Force_N'],
            sampleRows: [
              ['S-1', 2.1, 14.5],
              ['S-2', 1.8, 18.2]
            ]
          }
        ]
      },
      {
        id: '3-3',
        code: '3-3',
        title: '완전요인실험 (Full Factorial)',
        keyword: '교호작용 (Interaction)',
        scenario: '초고강도 복합소재 사출 성형에서 수지 온도(A), 사출 압력(B), 냉각 시간(C)의 3요인 2수준(2³) 완전요인실험을 수행했습니다. 데이터 분석 결과 수지 온도나 사출 압력의 단독 주효과보다 온도와 압력의 교호작용(A*B Interaction) 효과가 충격강도에 가장 지배적인 영향을 미치고 있음이 확인되었습니다. 온도가 고수준일 때는 압력이 높을수록 강도가 증가하지만, 저수준일 때는 오히려 급격히 감소하는 비평행 교호작용 그래프를 해석하고 주효과만 고려했을 때의 오류를 방지하는 최적 조합을 도출하시오.',
        files: [
          {
            name: 'Full_Factorial_2_cubed.csv',
            size: '1.3 MB',
            type: 'csv',
            description: '2³ 완전요인실험 8개 조합 x 반복 4회 인장강도',
            sampleHeaders: ['StdOrder', 'Factor_A_Temp', 'Factor_B_Press', 'Factor_C_Cool', 'Strength'],
            sampleRows: [
              [1, -1, -1, -1, 120.4],
              [2, 1, -1, -1, 115.2],
              [3, -1, 1, -1, 98.6],
              [4, 1, 1, -1, 154.8]
            ]
          },
          {
            name: 'Interaction_Matrix_ANOVA.xlsx',
            size: '680 KB',
            type: 'xlsx',
            description: 'A, B, C 주효과 및 AB, AC, BC, ABC 교호작용 분석표',
            sampleHeaders: ['Term', 'Effect', 'Coef', 'T_Value', 'P_Value', 'VIF'],
            sampleRows: [
              ['Temp*Press (AB)', 28.5, 14.25, 7.82, 0.00001, 1.0],
              ['Temp (A)', 10.2, 5.1, 2.80, 0.012, 1.0]
            ]
          },
          {
            name: 'Impact_Resistance_Test.csv',
            size: '890 KB',
            type: 'csv',
            description: '조합별 아이조드 충격 시험치 및 파단면 분석',
            sampleHeaders: ['Run', 'Izod_J_m', 'Fracture_Mode'],
            sampleRows: [
              [1, 45.2, 'Brittle'],
              [4, 82.6, 'Ductile']
            ]
          }
        ]
      },
      {
        id: '3-4',
        code: '3-4',
        title: '부분요인실험 (Fractional Factorial)',
        keyword: '교락 (Confounding)',
        scenario: '스마트폰 디스플레이 글래스 코팅 라인에서 잠재적 영향 인자가 5개(A:가스유량, B:RF파워, C:진공도, D:기판거리, E:증착시간)에 달하지만, 비용과 시간 제약으로 32회 완전실험 대신 16회 2^(5-1) 부분요인실험(해상도 V)을 계획하고 있습니다. 생성자(Generator) E = ABCD를 사용할 때 주요 인자의 주효과가 4인자 교호작용과 교락되고 2인자 교호작용끼리 3인자와 교락되는 별칭 구조(Alias Structure)를 평가하고, 고차 교호작용이 무시 가능하다는 희소성의 원리(Sparsity of Effects) 하에서 최적 인자를 선별하시오.',
        files: [
          {
            name: 'Fractional_Factorial_2_5_minus_1.csv',
            size: '1.2 MB',
            type: 'csv',
            description: '16개 런 부분요인 실험표 및 반사율/투과율 결과',
            sampleHeaders: ['Run', 'A_Gas', 'B_Power', 'C_Vac', 'D_Dist', 'E_Time', 'Reflectance'],
            sampleRows: [
              [1, -1, -1, -1, -1, 1, 0.85],
              [2, 1, -1, -1, -1, -1, 1.12],
              [3, -1, 1, -1, -1, -1, 0.94]
            ]
          },
          {
            name: 'Alias_Structure_Table.xlsx',
            size: '560 KB',
            type: 'xlsx',
            description: '해상도 V 별칭 관계 및 교락 매트릭스',
            sampleHeaders: ['Factor_Term', 'Aliased_With', 'Resolution', 'Risk_Assessment'],
            sampleRows: [
              ['A', 'A + BCDE', 'Res V', 'Clear of 2-factor & 3-factor'],
              ['AB', 'AB + CDE', 'Res V', 'Clear of other 2-factor']
            ]
          },
          {
            name: 'Screening_Pareto_Effects.csv',
            size: '430 KB',
            type: 'csv',
            description: '표준화된 효과의 파레토 차트 데이터셋',
            sampleHeaders: ['Factor_Name', 'Standardized_Effect', 'T_Critical', 'Significant'],
            sampleRows: [
              ['B_Power', 4.82, 2.12, 'Yes'],
              ['E_Time', 3.91, 2.12, 'Yes']
            ]
          }
        ]
      },
      {
        id: '3-5',
        code: '3-5',
        title: '반응표면분석법 (RSM) 기초',
        keyword: '최적화 (Optimization)',
        scenario: '바이오 의약품 발효 공정에서 항체 단백질의 생산 수율을 극대화하기 위해 1차 선별 실험을 마친 후 중심합성계획(CCD, Central Composite Design)을 적용한 반응표면분석법(RSM)을 도입했습니다. 2차 회귀모형을 적합하여 등고선도(Contour Plot) 및 3D 표면도를 생성한 결과 강한 곡률(Curvature)이 확인되었으며 안장점(Saddle Point) 부근에 도달했습니다. 능선 분석(Ridge Analysis) 및 만족도 함수(Desirability Function)를 활용하여 생산 수율 95% 이상과 부산물 농도 2% 이하를 동시에 달성하는 최적 제어점(배양온도, pH, 교반속도)을 도출하시오.',
        files: [
          {
            name: 'CCD_Fermentation_RSM.csv',
            size: '1.8 MB',
            type: 'csv',
            description: '중심점/축점 포함 중심합성계획 20회 실험 결과',
            sampleHeaders: ['Pt_Type', 'Temp_C', 'pH', 'RPM', 'Yield_g_L', 'Byproduct_Pct'],
            sampleRows: [
              ['Factorial', 34.0, 6.8, 250, 4.8, 1.8],
              ['Axial', 37.0, 7.0, 300, 5.9, 1.4],
              ['Center', 35.5, 7.0, 275, 6.2, 1.2]
            ]
          },
          {
            name: 'RSM_Quadratic_Model.xlsx',
            size: '790 KB',
            type: 'xlsx',
            description: '2차 다항식 회귀계수, 적합도 결여(Lack of Fit) 검정',
            sampleHeaders: ['Term', 'Estimate', 'Std_Error', 'P_Value', 'Significance'],
            sampleRows: [
              ['Temp^2', -0.42, 0.08, 0.0003, 'Strong Curvature'],
              ['pH^2', -0.58, 0.09, 0.0001, 'Strong Curvature']
            ]
          },
          {
            name: 'Desirability_Profiles.csv',
            size: '510 KB',
            type: 'csv',
            description: '다중 반응 만족도 함수 최적화 해(Composite D)',
            sampleHeaders: ['Response', 'Target', 'Current_Solution', 'Individual_D', 'Composite_D'],
            sampleRows: [
              ['Yield', 6.5, 6.32, 0.94, 0.92],
              ['Byproduct', 1.0, 1.15, 0.90, 0.92]
            ]
          }
        ]
      }
    ]
  },
  {
    id: 4,
    name: '통계적공정관리',
    englishName: 'Statistical Process Control (SPC)',
    items: [
      {
        id: '4-1',
        code: '4-1',
        title: '변동의 이해와 SPC 개념',
        keyword: '이상원인 (Special Cause)',
        scenario: '정밀 기계 부품 CNC 연삭 가공 라인에서 일상적으로 발생하는 우연원인(Common Cause) 변동과 설비 오작동으로 인한 이상원인(Special Cause) 변동을 구분하지 못해 현장 혼란이 극심합니다. 단순 공차 이탈이 아님에도 불구하고 넬슨 룰(Nelson Rules) 8가지 중 3번 규칙(연속 6개 점 증가/감소)과 2번 규칙(연속 9개 점이 중심선 한쪽)이 감지되었으나, 작업자가 임의로 설비 오프셋을 재조정하여 오히려 공정 변동을 증폭시키는 과잉조정(Over-adjustment) 문제가 발생했습니다. 관리상태와 이상원인의 차이를 규명하고 SPC 표준 대응 절차를 수립하시오.',
        files: [
          {
            name: 'CNC_Grinding_Measurements.csv',
            size: '2.5 MB',
            type: 'csv',
            description: '시간대별 연삭 치수 및 설비 오프셋 조정 이력',
            sampleHeaders: ['Subgroup', 'Time', 'Dimension_mm', 'Tool_Offset_Adjusted'],
            sampleRows: [
              [1, '09:00', 50.002, 'No'],
              [2, '09:30', 50.006, 'No'],
              [3, '10:00', 50.012, 'Yes (+0.01)']
            ]
          },
          {
            name: 'Nelson_Rules_Violation_Log.xlsx',
            size: '840 KB',
            type: 'xlsx',
            description: '넬슨 룰 8개 기준 위반 타임라인 및 이상원인 태그',
            sampleHeaders: ['Rule_No', 'Description', 'Detected_At', 'Likely_Special_Cause'],
            sampleRows: [
              ['Rule 2', '9 points on one side of center', 'Subgroup 42', 'Coolant temp rise'],
              ['Rule 3', '6 points trending upward', 'Subgroup 88', 'Tool wear progressive']
            ]
          },
          {
            name: 'Tampering_Experiment_Summary.csv',
            size: '620 KB',
            type: 'csv',
            description: '데밍 깔때기 실험 기반 과잉조정 시 분산 확대 비교',
            sampleHeaders: ['Control_Strategy', 'Process_Variance', 'Defect_Rate_PPM'],
            sampleRows: [
              ['Rule-Based SPC (No Tampering)', 0.00042, 140],
              ['Frequent Manual Tampering', 0.00168, 3850]
            ]
          }
        ]
      },
      {
        id: '4-2',
        code: '4-2',
        title: '측정시스템 분석 (MSA)',
        keyword: 'Gage R&R (반복성 및 재현성)',
        scenario: '전기차 배터리 셀 두께 검사 공정에서 측정 장비 간 계측 편차 클레임이 발생하여 3명의 작업자(Appraiser)와 10개의 대표 부품(Part), 3회 반복 측정(Trials)을 바탕으로 교차 Gage R&R(Gage Repeatability & Reproducibility) 평가를 실시했습니다. 분석 결과 총 변동 대비 %Gage R&R(%Study Variation)이 32.4%로 계산되어 AIAG 가이드라인 기준 30%를 초과하는 수용 불가 판정이 내려졌으며 구별 범주 수(ndc) 역시 3으로 측정 시스템의 분해능이 매우 취약합니다. 반복성과 재현성 중 어떤 요인이 게이지 오차를 유발하는지 분석하고 측정 시스템 개선 방안을 제시하시오.',
        files: [
          {
            name: 'Gage_RR_Raw_Data.csv',
            size: '1.4 MB',
            type: 'csv',
            description: '3인 작업자 x 10개 부품 x 3회 반복 측정치',
            sampleHeaders: ['Part_No', 'Operator', 'Trial', 'Measured_Thickness_mm'],
            sampleRows: [
              [1, 'Op_A', 1, 15.24],
              [1, 'Op_A', 2, 15.26],
              [1, 'Op_B', 1, 15.38]
            ]
          },
          {
            name: 'ANOVA_Gage_RR_Report.xlsx',
            size: '670 KB',
            type: 'xlsx',
            description: '부품 간 변동, 반복성(EV), 재현성(AV), ndc 산출표',
            sampleHeaders: ['Source', 'StdDev_SD', 'Study_Var_6SD', 'Pct_Study_Var', 'Pct_Tolerance'],
            sampleRows: [
              ['Total Gage R&R', 0.038, 0.228, 32.4, 28.5],
              ['Repeatability (EV)', 0.031, 0.186, 26.4, 23.2],
              ['Reproducibility (AV)', 0.022, 0.132, 18.7, 16.5]
            ]
          },
          {
            name: 'Operator_Bias_Summary.csv',
            size: '410 KB',
            type: 'csv',
            description: '작업자별 클램핑 압력 측정 프로파일 및 편향도',
            sampleHeaders: ['Operator', 'Mean_Pressure_N', 'Systematic_Bias_um'],
            sampleRows: [
              ['Op_A', 45.2, 0.0],
              ['Op_B', 68.4, +12.5]
            ]
          }
        ]
      },
      {
        id: '4-3',
        code: '4-3',
        title: '계량형 관리도',
        keyword: '관리한계선 (Control Limits)',
        scenario: '초정밀 렌즈 연마 공정에서 부분군(Subgroup 크기 n=5) 단위로 렌즈 곡률 반경 데이터를 수집하여 Xbar-R(평균 및 범위) 관리도를 운영하고 있습니다. 그러나 품질팀이 관리한계선(UCL, LCL)과 고객 규격한계선(USL, LSL)의 수학적 원리를 혼동하여, 규격 상하한선을 관리도에 그대로 기입하거나 3시그마 관리한계를 임의로 좁혀 놓아 정상적인 공정에서도 라인이 지속적으로 정지되고 있습니다. 중심선(CL)과 ±3A₂R / ±3D₄R 공식에 입각한 엄밀한 계량형 관리한계선을 재산출하고 공정 안정 상태를 재평가하시오.',
        files: [
          {
            name: 'Lens_Curvature_Subgroups.csv',
            size: '2.8 MB',
            type: 'csv',
            description: '30개 부분군(n=5) 렌즈 곡률 반경 측정 데이터셋',
            sampleHeaders: ['Subgroup_ID', 'X1', 'X2', 'X3', 'X4', 'X5', 'X_bar', 'R_val'],
            sampleRows: [
              [1, 100.02, 100.05, 99.98, 100.01, 100.04, 100.020, 0.07],
              [2, 100.08, 100.04, 100.07, 100.09, 100.02, 100.060, 0.07]
            ]
          },
          {
            name: 'Xbar_R_Control_Limits.xlsx',
            size: '590 KB',
            type: 'xlsx',
            description: 'A2, D3, D4 계수 적용 공식 및 관리선 계산표',
            sampleHeaders: ['Chart_Type', 'LCL', 'Center_Line', 'UCL', 'Formula'],
            sampleRows: [
              ['Xbar_Chart', 99.982, 100.025, 100.068, 'X_doublebar +/- A2*R_bar'],
              ['R_Chart', 0.0, 0.074, 0.156, 'D3*R_bar, D4*R_bar']
            ]
          },
          {
            name: 'Spec_vs_Control_Comparison.csv',
            size: '480 KB',
            type: 'csv',
            description: '규격한계(USL/LSL) 대 공정능력 자연공차(6σ) 비교',
            sampleHeaders: ['Parameter', 'LSL', 'USL', 'Process_6Sigma', 'Margin'],
            sampleRows: [
              ['Curvature', 99.90, 100.15, 0.18, 0.07]
            ]
          }
        ]
      },
      {
        id: '4-4',
        code: '4-4',
        title: '계수형 관리도',
        keyword: '불량비율 (Defect Rate)',
        scenario: 'PCB 표면실장(SMT) 솔더링 라인에서 일일 생산 로트 크기가 2,000개에서 8,000개까지 유동적으로 변동함에도 불구하고, 고정 표본 크기용 np 관리도를 사용하여 관리한계선이 왜곡되는 문제가 발생하고 있습니다. 로트 크기가 가변적인 상황에 적합한 p 관리도(불량률 관리도) 또는 결점수 기반 u 관리도로의 전환이 시급합니다. 로트별 크기 변동에 따라 동적으로 가변되는 관리한계선(Variable Control Limits)을 계산하고, 최근 불량비율이 급격히 튀어 오른 원인이 특정 부품 패키지의 납땜 불량에 기인하는지 계수형 데이터를 심층 검증하시오.',
        files: [
          {
            name: 'SMT_Defect_Lot_Data.csv',
            size: '2.1 MB',
            type: 'csv',
            description: '로트별 검사수량(n), 불량수(np), 불량비율(p) 추이',
            sampleHeaders: ['Lot_No', 'Inspected_Units_N', 'Defective_Units', 'Defect_Rate_P'],
            sampleRows: [
              ['LOT-101', 3500, 28, 0.0080],
              ['LOT-102', 7200, 94, 0.0131],
              ['LOT-103', 2100, 42, 0.0200]
            ]
          },
          {
            name: 'P_Chart_Variable_Limits.xlsx',
            size: '710 KB',
            type: 'xlsx',
            description: '가변 로트 크기별 p관리도 UCL/LCL 계산 모델',
            sampleHeaders: ['Lot_No', 'P_Bar', 'P_Sigma', 'UCL_i', 'LCL_i', 'Out_of_Control'],
            sampleRows: [
              ['LOT-101', 0.0115, 0.0018, 0.0169, 0.0061, 'No'],
              ['LOT-103', 0.0115, 0.0023, 0.0184, 0.0046, 'YES (Out of Control)']
            ]
          },
          {
            name: 'Defect_Categorization_Log.csv',
            size: '860 KB',
            type: 'csv',
            description: '브릿지, 미납, 틀어짐 등 결점 유형별 상세 파레토',
            sampleHeaders: ['Defect_Type', 'Occurrence_Count', 'Cumulative_Pct'],
            sampleRows: [
              ['Solder_Bridging', 412, 54.2],
              ['Insufficient_Solder', 215, 82.5]
            ]
          }
        ]
      },
      {
        id: '4-5',
        code: '4-5',
        title: '공정능력 지수',
        keyword: 'Cpk (단기 공정능력지수)',
        scenario: '글로벌 완성차 고객사 납품을 앞둔 알루미늄 다이캐스팅 변속기 하우징 공정에서 고객사 요구 Cpk 기준치는 1.33 이상이나 현재 측정된 단기 공정능력지수 Cpk는 0.98에 머물러 출하 검사 통과가 불투명합니다. 세부 분석 결과 분산에 의한 잠재 공정능력 Cp는 1.45로 충분히 양호하지만, 공정 평균(Mean)이 목표 중심값에서 상한 규격(USL) 방향으로 심하게 치우쳐 치우침 계수 k값이 0.32에 달하고 있습니다. Cp와 Cpk의 괴리 원인을 분석하고 공정 평균을 센터링(Centering)하기 위한 최적 조정 파라미터를 제안하시오.',
        files: [
          {
            name: 'Housing_Machining_Capability.csv',
            size: '3.4 MB',
            type: 'csv',
            description: '하우징 주요 가공부 치수 500개 샘플 연속 데이터',
            sampleHeaders: ['Sample_ID', 'Dimension_mm', 'USL', 'LSL', 'Target'],
            sampleRows: [
              [1, 55.08, 55.10, 54.90, 55.00],
              [2, 55.07, 55.10, 54.90, 55.00]
            ]
          },
          {
            name: 'Cp_Cpk_Calculation_Sheet.xlsx',
            size: '640 KB',
            type: 'xlsx',
            description: 'Cp, Cpk, Cpu, Cpl, Ppk 통계량 및 치우침(k) 계산서',
            sampleHeaders: ['Metric', 'Formula', 'Calculated_Value', 'Benchmark_1_33'],
            sampleRows: [
              ['Cp', '(USL-LSL)/(6*Sigma)', 1.452, 'Pass'],
              ['Cpk', 'Min(Cpu, Cpl)', 0.984, 'FAIL (Action Required)'],
              ['Centering_Bias_K', '|Target - Mean| / (Tolerance/2)', 0.322, 'Severe Bias']
            ]
          },
          {
            name: 'Tool_Wear_Offset_Log.csv',
            size: '520 KB',
            type: 'csv',
            description: '가공 팁 오프셋 마모 주기 및 중심 이동 궤적',
            sampleHeaders: ['Cycle_Count', 'Mean_Shift_um', 'Recommended_Offset_Adj'],
            sampleRows: [
              [100, +15.4, -0.015],
              [200, +32.1, -0.030]
            ]
          }
        ]
      }
    ]
  },
  {
    id: 5,
    name: '구조적 문제해결 방법론',
    englishName: 'Structured Problem Solving',
    items: [
      {
        id: '5-1',
        code: '5-1',
        title: '문제 정의와 현상 파악',
        keyword: 'As-Is 정량화 (Quantification)',
        scenario: '스마트 물류창고 피킹 로봇 시스템에서 빈번한 패키지 낙하 파손으로 인해 고객 불만이 증가하고 있으나, 현장 관리자들은 "로봇이 불안정하다"는 식의 모호한 정성적 문제 제기만 반복하고 있습니다. 5W2H 프레임워크와 결함 데이터베이스를 결합하여 언제(시간대별), 어디서(특정 랙 선반 위치), 무엇이(중량 5kg 이상 비정형 화물), 얼만큼(월 182건, 손실액 4,800만원, 파손율 3.8%) 발생하는지 As-Is 상태를 철저히 정량화(Quantification)하고, 목표(To-Be 파손율 0.5% 이하)와의 갭(Gap)을 구체적인 KPI 수치로 정의하시오.',
        files: [
          {
            name: 'Robot_Picking_Incidents_AsIs.csv',
            size: '2.4 MB',
            type: 'csv',
            description: '월간 182건 피킹 낙하 파손 이벤트 상세 로그',
            sampleHeaders: ['Incident_ID', 'Timestamp', 'Rack_Zone', 'Item_Weight_kg', 'Loss_Cost_KRW'],
            sampleRows: [
              ['INC-001', '2026-10-02 14:22', 'Zone_C_High', 6.2, 280000],
              ['INC-002', '2026-10-02 18:45', 'Zone_C_High', 7.8, 450000]
            ]
          },
          {
            name: '5W2H_Quantification_Matrix.xlsx',
            size: '620 KB',
            type: 'xlsx',
            description: '5W2H 기반 정량 지표 정의 및 결함 파레토 분석',
            sampleHeaders: ['Question', 'Current_AsIs', 'Target_ToBe', 'Gap_Metric'],
            sampleRows: [
              ['What', '3.8% breakage rate', '0.5% breakage rate', '-3.3%p reduction'],
              ['How Much', '48,000,000 KRW/month', '6,000,000 KRW/month', '42,000,000 KRW savings']
            ]
          },
          {
            name: 'Cargo_Weight_Dimension_Log.csv',
            size: '830 KB',
            type: 'csv',
            description: '파손 화물 중량, 형태, 파지 표면 조도 측정 데이터',
            sampleHeaders: ['Cargo_Type', 'Rigid_Box', 'Irregular_Pouch', 'Damage_Frequency'],
            sampleRows: [
              ['Box', 12000, 0, 12],
              ['Pouch', 0, 4500, 170]
            ]
          }
        ]
      },
      {
        id: '5-2',
        code: '5-2',
        title: '데이터 기반 원인 분석',
        keyword: '근본 원인 (Root Cause)',
        scenario: '정밀 바이오 진단키트 밀봉 공정에서 기밀성(Hermetic Seal) 누설 불량이 발생하여 제조본부는 단순 히터 온도 부족으로 단정하고 온도를 지속적으로 높였으나 누설 불량이 해소되지 않고 필름 변형이라는 2차 불량만 야기되었습니다. 특성요인도(Fishbone Diagram)와 5-Why 기법을 현장 공정 센서 데이터(압력 프로파일, 체류 시간, 실링 앤빌 평행도)와 결합하여 가설을 수립하고, 진짜 근본 원인(Root Cause)이 히터 온도가 아닌 실링 헤드의 미세한 기계적 틀어짐(편마모)임을 통계적 상관 데이터로 실증하시오.',
        files: [
          {
            name: 'Sealing_Process_Telemetry.csv',
            size: '3.1 MB',
            type: 'csv',
            description: '실링 온도, 가압력, 체류시간 및 기밀 누설 시험치',
            sampleHeaders: ['Lot_No', 'Heater_Temp_C', 'Seal_Pressure_bar', 'Leak_Rate_Pa_s'],
            sampleRows: [
              ['L-501', 185.0, 4.2, 0.08],
              ['L-502', 195.0, 4.2, 0.09],
              ['L-503', 185.0, 2.1, 0.45]
            ]
          },
          {
            name: '5Why_RootCause_Verification.xlsx',
            size: '710 KB',
            type: 'xlsx',
            description: '5-Why 단계별 가설 검증 및 p-value 통계 실증표',
            sampleHeaders: ['Why_Level', 'Hypothesis', 'Data_Evidence', 'P_Value', 'Is_Root_Cause'],
            sampleRows: [
              ['Why 1', 'Insufficient heat', 'Temp raised, no improvement', 0.84, 'No'],
              ['Why 4', 'Anvil parallelism tilt', 'Laser micrometer tilt 0.12mm', 0.0002, 'YES']
            ]
          },
          {
            name: 'Anvil_Surface_Wear_Profile.csv',
            size: '560 KB',
            type: 'csv',
            description: '실링 앤빌 좌우 높이 편차 및 접촉 압력 분포도',
            sampleHeaders: ['Position_Left_mm', 'Position_Right_mm', 'Pressure_Diff_pct'],
            sampleRows: [
              [10.02, 9.88, 28.5],
              [10.01, 9.87, 29.1]
            ]
          }
        ]
      },
      {
        id: '5-3',
        code: '5-3',
        title: '핵심 인자(Vital Few) 검증',
        keyword: '핵심 인자 (Vital Few)',
        scenario: '반도체 식각 공정에서 웨이퍼 식각 균일도(Uniformity)에 영향을 미칠 수 있는 공정 변수가 총 24개에 달하여 통제 불능 상태에 빠져 있습니다. 수많은 사소한 인자(Trivial Many) 중에서 실제 불량 변동의 80% 이상을 유발하는 소수의 핵심 인자(Vital Few)를 선별하기 위해 다변량 회귀분석과 랜덤 포레스트 변수 중요도(Feature Importance), 파레토 누적 기여율을 계산했습니다. 상위 3개 핵심 인자(가스 혼합비, 척 바이어스 전압, 챔버 내부 압력)를 통계적으로 규명하고 공정 집중 관리 계획을 도출하시오.',
        files: [
          {
            name: 'Etch_24_Parameters_Raw.csv',
            size: '4.6 MB',
            type: 'csv',
            description: '식각 챔버 24개 센서 파라미터 및 식각 불균일도',
            sampleHeaders: ['Wafer_ID', 'Gas_Ratio_CF4', 'Chamber_Press', 'Chuck_Bias', 'Uniformity_Pct'],
            sampleRows: [
              ['W-101', 0.35, 12.4, 250, 98.4],
              ['W-102', 0.42, 18.2, 180, 89.2]
            ]
          },
          {
            name: 'Vital_Few_Pareto_Ranking.xlsx',
            size: '640 KB',
            type: 'xlsx',
            description: '24개 인자 분산 설명력, 회귀 계수 및 누적 기여도',
            sampleHeaders: ['Factor_Name', 'Importance_Score', 'Cum_Contribution_Pct', 'Classification'],
            sampleRows: [
              ['Gas_Ratio_CF4', 0.42, 42.0, 'Vital Few'],
              ['Chuck_Bias', 0.28, 70.0, 'Vital Few'],
              ['Chamber_Press', 0.15, 85.0, 'Vital Few']
            ]
          },
          {
            name: 'Correlation_Matrix_24Var.csv',
            size: '950 KB',
            type: 'csv',
            description: '24개 공정 변수 간 다중공선성 및 상관계수 행렬',
            sampleHeaders: ['Var_1', 'Var_2', 'Pearson_R', 'VIF_Score'],
            sampleRows: [
              ['Gas_Ratio_CF4', 'Uniformity', -0.81, 1.45],
              ['Chuck_Bias', 'Uniformity', 0.74, 1.62]
            ]
          }
        ]
      },
      {
        id: '5-4',
        code: '5-4',
        title: '최적 대안 도출 및 평가',
        keyword: '우선순위 (Priority)',
        scenario: '전기차 충전기 생산 라인의 조립 공정 병목 현상을 해소하기 위해 5가지 개선 대안(A: 자동화 로봇 도입, B: 작업 셀 레이아웃 재배치, C: 부품 사전 키팅 시스템 구축, D: 2교대 인력 증원, E: 모듈형 체결 공구 도입)이 제안되었습니다. 각 대안에 대해 기술적 실현 가능성(Feasibility), 비용 대비 효과(ROI), 적용 소요 기간, 안전성 등의 다면 평가 기준(Pugh Matrix 및 가중치 의사결정 매트릭스)을 적용하여 우선순위(Priority)를 객관적으로 도출하고 단계별 롤아웃 로드맵을 수립하시오.',
        files: [
          {
            name: 'Improvement_Alternatives_List.csv',
            size: '1.2 MB',
            type: 'csv',
            description: '5대 개선 대안별 세부 스펙, 투자비용, 단축 예상시간',
            sampleHeaders: ['Option_Code', 'Option_Name', 'CapEx_KRW', 'Cycle_Time_Reduction_sec'],
            sampleRows: [
              ['Opt_A', 'Auto Screw Robot', 240000000, 35],
              ['Opt_B', 'Cell Layout Redesign', 15000000, 22],
              ['Opt_C', 'Parts Kitting System', 8000000, 18]
            ]
          },
          {
            name: 'Weighted_Decision_Matrix_Pugh.xlsx',
            size: '580 KB',
            type: 'xlsx',
            description: '가중치 평가표(ROI, 실현성, 기간, 리스크) 및 점수',
            sampleHeaders: ['Option', 'Feasibility_30', 'ROI_30', 'Speed_20', 'Safety_20', 'Total_Score', 'Rank'],
            sampleRows: [
              ['Opt_B (Layout)', 28, 29, 18, 19, 94, 1],
              ['Opt_C (Kitting)', 27, 28, 19, 18, 92, 2],
              ['Opt_A (Robot)', 18, 22, 12, 16, 68, 4]
            ]
          },
          {
            name: 'Bottleneck_Cycle_Time_Log.csv',
            size: '720 KB',
            type: 'csv',
            description: '공정 단계별 현재 택트타임(Tact Time) 측정 데이터',
            sampleHeaders: ['Station_ID', 'Station_Name', 'Cycle_Time_sec', 'Is_Bottleneck'],
            sampleRows: [
              ['ST-10', 'Inverter Assembly', 88.5, 'YES'],
              ['ST-20', 'Cable Wiring', 52.0, 'No']
            ]
          }
        ]
      },
      {
        id: '5-5',
        code: '5-5',
        title: '실행, 검증 및 표준화',
        keyword: '관리계획 (Control Plan)',
        scenario: '식음료 캔 밀봉(Double Seaming) 공정의 딤플 결함을 개선하기 위한 롤러 갭 최적화 작업을 완료한 후, 개선 효과가 일회성에 그치지 않고 지속되도록 관리계획서(Control Plan)와 표준작업지침서(SOP)를 개정해야 합니다. 파일럿 양산 30일 동안의 불량률 추이를 Paired t-test를 통해 통계적으로 유의미하게 검증(개선 전 2.4% -> 개선 후 0.2%, p < 0.001)하고, 설비 일상 점검 주기, 게이지 검교정 주기, 이상 발생 시 에스컬레이션 트리거를 명시한 표준화 문서를 완성하시오.',
        files: [
          {
            name: 'Pre_Post_Improvement_30Days.csv',
            size: '1.9 MB',
            type: 'csv',
            description: '개선 전후 30일간 일별 생산량 및 결함 수율 비교',
            sampleHeaders: ['Day', 'Pre_Defect_Rate', 'Post_Defect_Rate', 'Difference'],
            sampleRows: [
              [1, 0.024, 0.0018, -0.0222],
              [2, 0.026, 0.0021, -0.0239]
            ]
          },
          {
            name: 'Control_Plan_Standard_Template.xlsx',
            size: '810 KB',
            type: 'xlsx',
            description: '공정 단계, 관리 특성, 측정 빈도, 반응 계획 명세서',
            sampleHeaders: ['Step', 'Process_Characteristic', 'Sample_Size', 'Frequency', 'Reaction_Plan'],
            sampleRows: [
              ['Seaming', 'Seam Thickness (1.20 +/- 0.02mm)', '5 cans', 'Every 2 Hours', 'Stop Line & Re-gap']
            ]
          },
          {
            name: 'SOP_Revision_Checklist.csv',
            size: '420 KB',
            type: 'csv',
            description: '표준 작업 절차서 개정 항목 및 작업자 교육 이력',
            sampleHeaders: ['Operator_ID', 'Training_Completed', 'Certification_Score'],
            sampleRows: [
              ['EMP-301', 'Yes', 96],
              ['EMP-302', 'Yes', 100]
            ]
          }
        ]
      }
    ]
  },
  {
    id: 6,
    name: '미니탭 기초',
    englishName: 'Minitab Basics',
    items: [
      {
        id: '6-1',
        code: '6-1',
        title: '기본 UI와 환경 설정',
        keyword: '세션 창 (Session Window)',
        scenario: '신입 엔지니어가 Minitab을 활용하여 품질 데이터를 분석하는 과정에서 워크시트(Worksheet)의 데이터와 세션 창(Session Window)의 통계 출력 결과를 유기적으로 연계하지 못하고 있습니다. 세션 창에 출력되는 회귀 계수 표, ANOVA 분산분석표, 적합도 지표 등의 텍스트 통계량을 정확히 판독하고, 분석 명령 프롬프트(CLI) 히스토리와 결과 로그를 표준 리포트 양식으로 복사 및 자동 저장할 수 있도록 환경 설정과 출력값 해석 가이드를 정리하시오.',
        files: [
          {
            name: 'Minitab_Session_Output_Log.csv',
            size: '950 KB',
            type: 'csv',
            description: '미니탭 세션 창에 기록된 분석 명령 및 결과 텍스트',
            sampleHeaders: ['Command_Line', 'Session_Output_Snippet', 'Output_Type'],
            sampleRows: [
              ['MTB > Regress C1 1 C2', 'The regression equation is C1 = 12.4 + 0.85 C2', 'Regression_Output'],
              ['MTB > ANOVA C1 = C2', 'Source DF SS MS F P: Factor 2 124.5 62.25 14.2 0.000', 'ANOVA_Output']
            ]
          },
          {
            name: 'Session_Window_Interpretation_Guide.xlsx',
            size: '520 KB',
            type: 'xlsx',
            description: '세션 창 주요 통계 용어(DF, SS, MS, F, P) 판독 가이드',
            sampleHeaders: ['Term', 'Full_Name', 'Meaning', 'Decision_Criteria'],
            sampleRows: [
              ['P', 'P-value', 'Probability of observing test statistic', 'P < 0.05: Significant'],
              ['R-Sq', 'Coefficient of Determination', 'Explained variance ratio', 'Higher is better']
            ]
          },
          {
            name: 'Worksheet_Session_Mapping.csv',
            size: '610 KB',
            type: 'csv',
            description: 'C1~C20 열 데이터 구조와 세션 분석 변수 맵핑표',
            sampleHeaders: ['Column_ID', 'Header_Name', 'Data_Format', 'Used_In_Analysis'],
            sampleRows: [
              ['C1', 'Response_Y', 'Numeric', 'Regression Y'],
              ['C2', 'Factor_X1', 'Numeric', 'Regression X']
            ]
          }
        ]
      },
      {
        id: '6-2',
        code: '6-2',
        title: '데이터 핸들링',
        keyword: '데이터 포맷팅 (Data Formatting)',
        scenario: 'ERP 및 MES 시스템에서 추출한 원시 엑셀 데이터가 숫자에 콤마(,)와 통화 기호가 섞여 있어 Minitab 워크시트 로드 시 텍스트(C-T) 컬럼으로 강제 변환되는 오류가 발생했습니다. 이로 인해 기초 통계 분석과 관리도 작성이 모두 비활성화되는 현상이 나타났습니다. 텍스트 형식으로 오인식된 데이터를 숫자형(Numeric) 및 날짜형(Date/Time)으로 올바르게 변환하고, 조건부 스택/언스택(Stack/Unstack) 및 데이터 코딩(Recode) 기법을 적용하여 분석 가능한 클린 워크시트로 재구성하시오.',
        files: [
          {
            name: 'MES_Raw_Minitab_Import.csv',
            size: '2.1 MB',
            type: 'csv',
            description: '특수문자 및 공백으로 오염된 MES 추출 원천 데이터',
            sampleHeaders: ['Lot_Code', 'Measured_Val_Raw', 'Date_Stamp', 'Operator_Code'],
            sampleRows: [
              ['LOT#001', ' 1,024.50 mm ', '2026/10/01 12:00:00', 'OP-99'],
              ['LOT#002', ' 1,018.20 mm ', '2026/10/01 12:05:00', 'OP-99']
            ]
          },
          {
            name: 'Data_Type_Conversion_Rules.xlsx',
            size: '480 KB',
            type: 'xlsx',
            description: 'Minitab 열 속성(C, C-T, C-D) 변환 및 정규표현식 규칙',
            sampleHeaders: ['Raw_Pattern', 'Target_Format', 'Minitab_Menu_Path', 'Result_Status'],
            sampleRows: [
              ['* mm', 'Numeric (C)', 'Data > Change Data Type', 'Valid Numeric'],
              ['YYYY/MM/DD', 'Date/Time (C-D)', 'Data > Change Data Type', 'Valid DateTime']
            ]
          },
          {
            name: 'Stack_Unstack_Example.csv',
            size: '390 KB',
            type: 'csv',
            description: '공정 호기별 열 나열 데이터를 단일 열 스택 구조로 전환',
            sampleHeaders: ['Machine_A', 'Machine_B', 'Stacked_Yield', 'Machine_Label'],
            sampleRows: [
              [98.2, 95.4, 98.2, 'A'],
              [97.8, 96.1, 95.4, 'B']
            ]
          }
        ]
      },
      {
        id: '6-3',
        code: '6-3',
        title: '기초 통계량 및 그래프 작성',
        keyword: '층별화 (Stratification)',
        scenario: '정밀 프레스 부품의 타발 하중 데이터 전체를 하나의 집단으로 보았을 때는 분포가 넓게 퍼져 분산이 통제되지 않는 것처럼 보이지만, 설비 호기별(1호기~4호기), 금형 번호별(Mold #1~#8), 작업조별(주간/야간)로 층별화(Stratification)하여 개별값 그림(Individual Value Plot)과 상자 그림(Boxplot)을 생성한 결과 특정 3호기의 5번 금형에서만 하중이 급증하는 국소적 이상 패턴이 명확히 드러났습니다. 데이터를 체계적으로 층별화하고 시각화 차트를 통해 핵심 변동 유발 인자를 특정하시오.',
        files: [
          {
            name: 'Press_Load_Stratified.csv',
            size: '3.2 MB',
            type: 'csv',
            description: '프레스 하중(kN), 설비호기, 금형번호, 작업조 기록 데이터',
            sampleHeaders: ['Stamp_ID', 'Press_Machine', 'Mold_No', 'Shift', 'Load_kN'],
            sampleRows: [
              ['ST-1001', 'Machine_1', 'Mold_1', 'Day', 142.5],
              ['ST-1002', 'Machine_3', 'Mold_5', 'Night', 188.4],
              ['ST-1003', 'Machine_3', 'Mold_5', 'Day', 185.2]
            ]
          },
          {
            name: 'Stratified_Summary_Stats.xlsx',
            size: '610 KB',
            type: 'xlsx',
            description: '호기x금형 교차 층별 평균, 표준편차, 사분위수 분석표',
            sampleHeaders: ['Machine', 'Mold', 'Count', 'Mean_Load', 'Std_Dev', 'IQR'],
            sampleRows: [
              ['Machine_3', 'Mold_5', 120, 186.8, 8.4, 11.2],
              ['Machine_1', 'Mold_1', 120, 142.1, 2.1, 3.0]
            ]
          },
          {
            name: 'Boxplot_Quartile_Data.csv',
            size: '520 KB',
            type: 'csv',
            description: '상자그림 작성을 위한 층별 Q1, Median, Q3, Whiskers 데이터',
            sampleHeaders: ['Group', 'Lower_Whisker', 'Q1', 'Median', 'Q3', 'Upper_Whisker'],
            sampleRows: [
              ['M3_Mold5', 165.0, 178.5, 186.5, 194.0, 208.0],
              ['M1_Mold1', 136.0, 140.5, 142.0, 143.5, 148.0]
            ]
          }
        ]
      },
      {
        id: '6-4',
        code: '6-4',
        title: '가설검정 실습',
        keyword: '결과 해석 (Result Interpretation)',
        scenario: '동일 사양의 절삭유를 공급하는 두 공급사(A사 vs B사) 제품을 실가공 라인에 적용한 후 가공 공구 수명(절삭 가공 시간)에 차이가 있는지를 2-표본 t-검정(2-Sample t-test)으로 검증했습니다. Minitab 세션 결과에서 귀무가설(μ₁ - μ₂ = 0), 계산된 t-값(2.45), 자유도(df=38), 양측 유의확률 p-value(0.019), 그리고 평균 차이의 95% 신뢰구간[1.84, 18.92시간]이 도출되었습니다. 이 세션 출력 결과를 통계적 학술 용어에 익숙하지 않은 현장 엔지니어가 명확히 납득할 수 있도록 직관적 비즈니스 의사결정 언어로 정확히 해석하시오.',
        files: [
          {
            name: 'Coolant_Tool_Life_Test.csv',
            size: '1.3 MB',
            type: 'csv',
            description: 'A사 vs B사 절삭유 사용 시 공구 수명(Hours) 원본치',
            sampleHeaders: ['Test_Run', 'Coolant_Supplier', 'Tool_Life_Hours', 'Spindle_RPM'],
            sampleRows: [
              [1, 'Supplier_A', 145.2, 8000],
              [2, 'Supplier_B', 134.8, 8000]
            ]
          },
          {
            name: 'Minitab_2SampleT_Session.xlsx',
            size: '540 KB',
            type: 'xlsx',
            description: '미니탭 세션창 2-표본 t검정 전문 및 신뢰구간 해석표',
            sampleHeaders: ['Statistical_Metric', 'Session_Output', 'Practical_Meaning'],
            sampleRows: [
              ['T-Value', '2.45', 'Difference is 2.45 times standard error'],
              ['P-Value', '0.019', 'Only 1.9% chance observed difference is random'],
              ['95% CI', '(1.84, 18.92)', 'Supplier A lasts 1.84 to 18.92 hrs longer']
            ]
          },
          {
            name: 'Tool_Cost_Benefit_Model.csv',
            size: '410 KB',
            type: 'csv',
            description: '공구 수명 연장에 따른 연간 공구 교체비용 절감액 모델',
            sampleHeaders: ['Life_Increase_Hours', 'Tool_Cost_Savings_Annual_KRW'],
            sampleRows: [
              [5.0, 45000000],
              [10.0, 90000000]
            ]
          }
        ]
      },
      {
        id: '6-5',
        code: '6-5',
        title: 'Minitab Assistant 활용',
        keyword: '자동 리포팅 (Auto Reporting)',
        scenario: '현업 실무자가 통계 모델 선정에 대한 확신이 부족하여 Minitab Assistant(어시스턴트) 메뉴를 활용해 공정 능력 분석과 측정 시스템 분석(Gage R&R)을 수행했습니다. Assistant가 자동 생성한 요약 리포트(Summary Report), 진단 리포트(Diagnostic Report), 공정 상태 리포트(Report Card) 상의 상태 카드(안정성, 정규성, 표본 수 충분성 녹색/적색 체크마크)를 검토하고, 자동 리포팅 기능의 편리성에만 의존하지 않고 리포트가 경고하는 잠재적 데이터 이상(소표본 경고 등)을 비판적으로 평가하는 보고서를 작성하시오.',
        files: [
          {
            name: 'Assistant_Capability_Summary.csv',
            size: '1.7 MB',
            type: 'csv',
            description: '미니탭 어시스턴트가 생성한 요약 리포트 수치 지표',
            sampleHeaders: ['Metric_Name', 'Status_Color', 'Value', 'Assistant_Advice'],
            sampleRows: [
              ['Stability', 'Green', 'Stable', 'No special causes observed'],
              ['Normality', 'Green', 'P=0.24', 'Data is normally distributed'],
              ['Sample Size', 'Yellow', 'N=45', 'Recommend at least 100 samples']
            ]
          },
          {
            name: 'Assistant_Diagnostic_Checks.xlsx',
            size: '620 KB',
            type: 'xlsx',
            description: 'Report Card 진단 기준 5개 항목 및 상세 진단평가',
            sampleHeaders: ['Checklist_Item', 'Evaluation', 'Threshold_Criteria', 'Engineering_Action'],
            sampleRows: [
              ['Subgroup_Independence', 'Pass', 'Autocorrelation P > 0.05', 'Maintain frequency'],
              ['Precision_Tolerance', 'Caution', 'P/T Ratio > 20%', 'Recalibrate gage']
            ]
          },
          {
            name: 'Report_Card_Action_Item.csv',
            size: '380 KB',
            type: 'csv',
            description: '어시스턴트 권고 기반 현장 개선 액션 아이템 목록',
            sampleHeaders: ['Action_ID', 'Trigger_Alert', 'Corrective_Measure'],
            sampleRows: [
              ['ACT-1', 'Sample Size Warning', 'Collect additional 55 parts']
            ]
          }
        ]
      }
    ]
  },
  {
    id: 7,
    name: '파이썬 리터러시',
    englishName: 'Python Literacy',
    items: [
      {
        id: '7-1',
        code: '7-1',
        title: '환경 구축과 기본 문법',
        keyword: '자료형 (Data Type)',
        scenario: '공정 자동화 설비에서 TCP/IP 소켓으로 수신되는 센서 데이터 스트림을 파이썬으로 수집하는 스크립트에서, 부동소수점(float) 데이터가 문자열(str)로 입력되거나 타임스탬프가 정수형(int) 유닉스 타임으로 뒤섞이면서 TypeError 연산 오류가 빈번하게 발생하고 있습니다. int, float, str, bool 등 파이썬 기본 자료형의 메모리 특성과 형 변환(Type Casting) 메커니즘을 규명하고, 데이터 수신 즉시 유효성 검사(Type Validation) 및 안전한 형 변환 처리를 수행하는 견고한 인제스천 코드를 구성하시오.',
        files: [
          {
            name: 'Socket_Sensor_Stream_Raw.csv',
            size: '2.1 MB',
            type: 'csv',
            description: '소켓 통신으로 수신된 다양한 자료형 혼재 원시 로그',
            sampleHeaders: ['Raw_Packet_ID', 'Timestamp_Str', 'Voltage_Mixed', 'Is_Active_Mixed'],
            sampleRows: [
              [1, '1728950400', '12.45', 'True'],
              [2, '1728950401', '12.48 V', '1'],
              [3, '1728950402', 'NULL', 'false']
            ]
          },
          {
            name: 'Type_Casting_Specification.xlsx',
            size: '510 KB',
            type: 'xlsx',
            description: '필드별 목표 자료형, 예외 처리 규칙 및 변환 함수',
            sampleHeaders: ['Field_Name', 'Raw_Type', 'Target_Type', 'Fallback_Value', 'Validation_Regex'],
            sampleRows: [
              ['Voltage', 'str', 'float', 0.0, '^[0-9]+(\\.[0-9]+)?$'],
              ['Is_Active', 'str/int', 'bool', false, '^(true|1|yes)$']
            ]
          },
          {
            name: 'Type_Error_Exception_Log.csv',
            size: '420 KB',
            type: 'csv',
            description: '기존 스크립트 실행 시 발생한 TypeError 스택 트레이스',
            sampleHeaders: ['Line_No', 'Error_Message', 'Offending_Value'],
            sampleRows: [
              [42, "TypeError: unsupported operand type(s) for +: 'float' and 'str'", "'12.48 V'"]
            ]
          }
        ]
      },
      {
        id: '7-2',
        code: '7-2',
        title: '제어문과 함수',
        keyword: '논리 제어 (Flow Control)',
        scenario: '스마트 물류 컨베이어 라인에서 바코드 스캔 결과에 따라 박스를 A/B/C 라인으로 분기하는 스크립트가 수십 개의 if-elif-else 중첩문으로 작성되어 있어 유지보수가 불가능하고 처리 지연(Latency)이 발생하고 있습니다. 복잡한 논리 제어(Flow Control) 흐름을 딕셔너리 매핑(Dispatch Table) 또는 패턴 매칭(match-case) 구조로 리팩토링하고, 무게 및 부피 검증 로직을 재사용 가능한 모듈형 함수(Function)로 분리하여 코드 가독성과 예외 복원력을 극대화하시오.',
        files: [
          {
            name: 'Conveyor_Routing_Rules.csv',
            size: '1.2 MB',
            type: 'csv',
            description: '바코드 접두사, 중량, 목적지별 분기 라우팅 테이블',
            sampleHeaders: ['Barcode_Prefix', 'Min_Weight_kg', 'Max_Weight_kg', 'Target_Chute'],
            sampleRows: [
              ['KR-EXP', 0.0, 5.0, 'Chute_A1'],
              ['KR-EXP', 5.0, 20.0, 'Chute_A2'],
              ['DOM-STD', 0.0, 30.0, 'Chute_B1']
            ]
          },
          {
            name: 'Legacy_Flow_Control_Code.xlsx',
            size: '640 KB',
            type: 'xlsx',
            description: '기존 중첩 if-elif 스파게티 코드 분석 및 분기 복잡도',
            sampleHeaders: ['Function_Block', 'Cyclomatic_Complexity', 'Max_Nesting_Depth', 'Execution_Time_ms'],
            sampleRows: [
              ['route_package()', 28, 6, 14.2],
              ['refactored_route()', 4, 1, 1.8]
            ]
          },
          {
            name: 'Package_Scan_Benchmark.csv',
            size: '790 KB',
            type: 'csv',
            description: '10,000건 패키지 스캔 시 분기 처리 시간 벤치마크',
            sampleHeaders: ['Run_ID', 'Approach', 'Processed_Count', 'Total_Time_sec'],
            sampleRows: [
              ['RUN-1', 'Nested_If_Else', 10000, 4.82],
              ['RUN-2', 'Dictionary_Dispatch', 10000, 0.65]
            ]
          }
        ]
      },
      {
        id: '7-3',
        code: '7-3',
        title: '데이터 구조 이해',
        keyword: '자료구조 (Data Structure)',
        scenario: '공장 내 자율주행 물류로봇(AGV) 50대의 실시간 위치 좌표와 작업 큐(Job Queue)를 관리하는 파이썬 백엔드에서, 빈번한 데이터 검색과 삽입이 일어나는 핵심 로직에 단순 리스트(List) 자료구조만 사용하여 O(N)의 시간복잡도로 인한 시스템 프리징이 발생하고 있습니다. 순서가 중요한 작업 대기열에는 덱(collections.deque), 고유 설비 상태 매핑에는 딕셔너리(Dict)와 해시 세트(Set)를 적용하여 O(1) 시간복잡도로 최적화하는 자료구조 설계안을 마련하시오.',
        files: [
          {
            name: 'AGV_Fleet_State_Log.csv',
            size: '2.8 MB',
            type: 'csv',
            description: 'AGV 50대 상태(ID, 배터리, 현재노드, 할당작업) 스냅샷',
            sampleHeaders: ['AGV_ID', 'Status', 'Battery_Pct', 'Current_Node_ID', 'Job_ID'],
            sampleRows: [
              ['AGV-01', 'MOVING', 85, 'NODE-402', 'JOB-8841'],
              ['AGV-02', 'IDLE', 94, 'NODE-101', null]
            ]
          },
          {
            name: 'Data_Structure_Complexity_Study.xlsx',
            size: '590 KB',
            type: 'xlsx',
            description: 'List vs Deque vs Dict 검색/삽입/삭제 시간복잡도 비교',
            sampleHeaders: ['Operation', 'List_Time', 'Deque_Time', 'Set_Dict_Time', 'Optimal_Choice'],
            sampleRows: [
              ['Queue Pop Front', 'O(N) - 12ms', 'O(1) - 0.002ms', 'N/A', 'collections.deque'],
              ['Lookup by ID', 'O(N) - 8.5ms', 'O(N) - 8.5ms', 'O(1) - 0.001ms', 'dict']
            ]
          },
          {
            name: 'Job_Queue_Latency_Profile.csv',
            size: '480 KB',
            type: 'csv',
            description: '작업 요청 초당 500건 인입 시 큐 대기 지연 프로파일',
            sampleHeaders: ['Batch', 'Queue_Length', 'Avg_Wait_Time_ms'],
            sampleRows: [
              [1, 50, 4.2],
              [2, 250, 38.6]
            ]
          }
        ]
      },
      {
        id: '7-4',
        code: '7-4',
        title: 'Pandas 기초 (데이터 입출력)',
        keyword: '데이터프레임 (DataFrame)',
        scenario: '여러 설비에서 서로 다른 인코딩(UTF-8, EUC-KR, CP949)과 구분자(콤마, 탭, 세미콜론)로 생성되는 월간 수천만 행의 대용량 생산 로그 CSV 파일들을 판다스로 불러오는 과정에서 인코딩 에러(UnicodeDecodeError)와 OOM(Out of Memory) 메모리 초과 에러가 발생하고 있습니다. chunksize 파라미터를 활용한 청크 단위 분할 로딩과 데이터 타입 다운캐스팅(int64->int16, category형 변환)을 적용하여 메모리 사용량을 70% 이상 절감하는 효율적 DataFrame 생성 파이프라인을 작성하시오.',
        files: [
          {
            name: 'Multi_Encoding_CSV_Samples.csv',
            size: '3.6 MB',
            type: 'csv',
            description: 'EUC-KR 및 UTF-8 혼합 저장된 원천 공정 이력 파일',
            sampleHeaders: ['Log_ID', 'Equipment_Name', 'Production_Count', 'Status_Korean'],
            sampleRows: [
              [1001, '압출 1호기', 450, '정상가동'],
              [1002, '압출 2호기', 320, '원료부족']
            ]
          },
          {
            name: 'Pandas_IO_Optimization_Guide.xlsx',
            size: '720 KB',
            type: 'xlsx',
            description: 'read_csv 최적화 옵션(dtypes, chunksize, parse_dates) 명세',
            sampleHeaders: ['Parameter', 'Default_Behavior', 'Optimized_Setting', 'Memory_Impact'],
            sampleRows: [
              ['dtype', 'Infer (float64/int64)', 'explicit uint16/category', '75% reduction'],
              ['chunksize', 'None (All in memory)', '100,000 rows', 'Constant Low RAM']
            ]
          },
          {
            name: 'Memory_Footprint_Benchmark.csv',
            size: '510 KB',
            type: 'csv',
            description: '자료형 변환 전후의 판다스 메모리 사용량(df.info) 측정치',
            sampleHeaders: ['Column_Name', 'Original_Memory_MB', 'Downcasted_Memory_MB', 'Reduction_Pct'],
            sampleRows: [
              ['Equipment_Name (str->cat)', 128.4, 8.2, 93.6],
              ['Count (int64->int16)', 64.2, 16.1, 74.9]
            ]
          }
        ]
      },
      {
        id: '7-5',
        code: '7-5',
        title: 'Pandas 기초 (데이터 가공)',
        keyword: '그룹화 (GroupBy)',
        scenario: '전국 5개 생산 공장의 1년 치 설비 가동 실적 데이터에서 라인별, 설비별, 일자별 종합설비효율(OEE)을 집계해야 합니다. 그러나 반복문(for row in df.iterrows)을 사용하여 한 번 집계할 때마다 수십 분이 소요되고 있습니다. 판다스의 핵심 연산인 groupby()와 agg() 집계 함수(평균, 합계, 표준편차 동시 산출), pivot_table(), 그리고 lambda 변환 연산을 적용하여 벡터화(Vectorized)된 고속 데이터 가공 파이프라인을 구축하시오.',
        files: [
          {
            name: 'Annual_Equipment_OEE_Raw.csv',
            size: '4.5 MB',
            type: 'csv',
            description: '1년간 5개 공장 라인별 가동시간, 정지시간, 생산량 데이터',
            sampleHeaders: ['Date', 'Plant_Code', 'Line_ID', 'Run_Minutes', 'Downtime_Min', 'Units_Made'],
            sampleRows: [
              ['2026-01-01', 'PLANT_ULSAN', 'LINE_01', 1380, 60, 4850],
              ['2026-01-01', 'PLANT_ASAN', 'LINE_03', 1200, 240, 3920]
            ]
          },
          {
            name: 'GroupBy_Agg_Performance.xlsx',
            size: '640 KB',
            type: 'xlsx',
            description: 'iterrows() vs groupby().agg() 실행 속도 비교 결과표',
            sampleHeaders: ['Method', 'Execution_Time_sec', 'Speedup_Factor', 'CPU_Utilization'],
            sampleRows: [
              ['df.iterrows() Loop', 842.5, '1.0x (Baseline)', 'Single Core 100%'],
              ['df.groupby().agg()', 1.8, '468x Faster', 'Vectorized SIMD']
            ]
          },
          {
            name: 'OEE_Pivot_Summary.csv',
            size: '890 KB',
            type: 'csv',
            description: '월별 x 공장별 OEE 피벗 집계 완성 테이블',
            sampleHeaders: ['Month', 'Ulsan_OEE', 'Asan_OEE', 'Changwon_OEE'],
            sampleRows: [
              ['2026-01', 88.4, 84.2, 91.0],
              ['2026-02', 89.1, 85.5, 90.8]
            ]
          }
        ]
      }
    ]
  },
  {
    id: 8,
    name: '프롬프트 엔지니어링과 바이브 코딩',
    englishName: 'Prompt Engineering & Vibe Coding',
    items: [
      {
        id: '8-1',
        code: '8-1',
        title: 'LLM 작동 원리와 프롬프트 구조',
        keyword: '맥락 부여 (Context Setting)',
        scenario: '품질 관리팀에서 생성형 AI를 활용해 고객 VOC(Voice of Customer) 불만 접수 내역을 분석하고 있으나, "이 불만들을 분류해줘"라는 단순한 단발성 프롬프트로 인해 모델이 매번 다른 카테고리를 자의적으로 생성하고 일관성 없는 환각(Hallucination) 응답을 내놓고 있습니다. 역할 부여(System Role), 명확한 목적 및 배경(Context Setting), 출력 형식 지정(JSON 스키마), Few-shot 예시(성공/실패 분류 사례)를 완비한 구조화된 프롬프트 프레임워크를 설계하고 모델의 응답 재현율을 검증하시오.',
        files: [
          {
            name: 'Customer_VOC_Raw_Samples.csv',
            size: '1.8 MB',
            type: 'csv',
            description: '고객 접수 불만 원문 500건 텍스트 데이터',
            sampleHeaders: ['VOC_ID', 'Channel', 'Complaint_Text', 'Submission_Date'],
            sampleRows: [
              ['VOC-01', 'CallCenter', '배터리 충전 중에 본체가 너무 뜨거워져서 꺼져요. 화재 날까 봐 무섭습니다.', '2026-10-05'],
              ['VOC-02', 'WebChat', '제품 옆면 도색이 벗겨져서 왔어요. 교환해주세요.', '2026-10-06']
            ]
          },
          {
            name: 'Structured_Prompt_Template.xlsx',
            size: '560 KB',
            type: 'xlsx',
            description: 'Role-Task-Context-Constraint 4단계 프롬프트 템플릿',
            sampleHeaders: ['Section', 'Instruction_Content', 'Required_Tokens', 'Output_Format'],
            sampleRows: [
              ['System Role', 'You are a Senior Automotive Quality Auditor', 45, 'System Message'],
              ['Context', 'ISO 9001 standard defect taxonomy', 120, 'Context Block']
            ]
          },
          {
            name: 'Zero_vs_FewShot_Benchmark.csv',
            size: '420 KB',
            type: 'csv',
            description: 'Zero-shot vs Few-shot 프롬프트 적용 시 분류 정확도 비교',
            sampleHeaders: ['Prompt_Type', 'Accuracy_Pct', 'Hallucination_Rate', 'Format_Compliance'],
            sampleRows: [
              ['Zero-shot Naive', 61.2, 14.8, 48.0],
              ['Structured Few-shot', 94.6, 0.4, 100.0]
            ]
          }
        ]
      },
      {
        id: '8-2',
        code: '8-2',
        title: '바이브 코딩의 이해',
        keyword: '자연어-코드 번역 (NL-to-Code)',
        scenario: '비전공 현업 실무자가 복잡한 통계 계산이나 시각화 대시보드를 직접 문법을 외워 코딩하는 대신, 자연어 지시(Natural Language)를 통해 온전한 파이썬 및 SQL 코드를 생성하고 수정하는 바이브 코딩(Vibe Coding)을 도입하고자 합니다. 그러나 애매한 일상어 지시로는 의도치 않은 패키지 사용이나 버그가 발생하므로, 요구사항의 입출력 명세(Input/Output Spec), 제약 조건, 에지 케이스(Edge Case)를 정밀하게 표현하여 의도한 코드로 100% 정확하게 번역(NL-to-Code)되도록 하는 프롬프트 작성 규칙을 수립하시오.',
        files: [
          {
            name: 'NL_Prompt_Code_Pairs.csv',
            size: '1.4 MB',
            type: 'csv',
            description: '자연어 요구사항 지시문과 생성된 파이썬 코드 쌍',
            sampleHeaders: ['Req_ID', 'Natural_Language_Prompt', 'Generated_Python_Code', 'Success_Flag'],
            sampleRows: [
              ['REQ-01', '판다스로 두께가 100 이상인 행만 필터링해서 평균 구해줘', 'df[df["thickness"] >= 100]["thickness"].mean()', 'Success'],
              ['REQ-02', '차트 예쁘게 그려줘', 'plt.plot(...) # Missing Labels and title', 'Vague_Failed']
            ]
          },
          {
            name: 'Vibe_Coding_Spec_Template.xlsx',
            size: '620 KB',
            type: 'xlsx',
            description: '바이브 코딩 성공률을 높이는 5대 필수 명세 가이드',
            sampleHeaders: ['Element', 'Description', 'Bad_Example', 'Good_Example'],
            sampleRows: [
              ['Input Spec', '데이터프레임 스키마와 컬럼명 명시', '내 데이터 표에서', 'columns: [Lot_ID, Temp_C]'],
              ['Output Spec', '리턴 형태 지정', '결과 내놔', 'return pandas Series with float values']
            ]
          },
          {
            name: 'Code_Generation_Error_Audit.csv',
            size: '480 KB',
            type: 'csv',
            description: '자연어 프롬프트 모호성으로 인한 코드 실행 에러 분석',
            sampleHeaders: ['Error_Type', 'Root_Cause_Prompt_Ambiguity', 'Mitigation_Rule'],
            sampleRows: [
              ['KeyError', '컬럼 이름을 프롬프트에 기재하지 않음', '항상 df.columns 샘플을 주입할 것']
            ]
          }
        ]
      },
      {
        id: '8-3',
        code: '8-3',
        title: '데이터 처리 프롬프팅 실습',
        keyword: '단계별 지시 (Step-by-Step)',
        scenario: '비정형 설비 고장 점검 일지(PDF/텍스트)에서 설비명, 고장 부위, 교체 부품, 수리 소요 시간을 추출하여 정형화된 데이터프레임으로 변환하는 작업을 LLM에 일괄 요청했을 때, 긴 문맥에서 일부 부품명이 누락되거나 수리 시간이 잘못 매핑되는 현상이 발생했습니다. CoT(Chain-of-Thought) 기법을 기반으로 "단계별로 생각하라(Think Step-by-Step)"는 지시를 부여하여 1단계 텍스트 정제, 2단계 개체명 인식, 3단계 교차 검증, 4단계 JSON 직렬화의 단계별 파이프라인 프롬프트를 설계하고 추출 정확도를 평가하시오.',
        files: [
          {
            name: 'Maintenance_Logs_Unstructured.csv',
            size: '2.5 MB',
            type: 'csv',
            description: '비정형 작업 일지 및 엔지니어 수기 메모 원문 200건',
            sampleHeaders: ['Log_ID', 'Date', 'Engineer', 'Free_Text_Narrative'],
            sampleRows: [
              ['M-01', '2026-10-01', '김철수', '1차 압출기 스크류 부근에서 이상 소음 발생. 확인 결과 베어링 마모 심각하여 신품(SKF-6205)으로 교체함. 작업시간 약 2시간 30분 소요.'],
              ['M-02', '2026-10-02', '박영희', '칠러 냉각수 라인 밸브 누수로 배관 테이핑 및 솔레노이드 교체 완료. 1시간 10분 정지.']
            ]
          },
          {
            name: 'Chain_of_Thought_Prompts.xlsx',
            size: '590 KB',
            type: 'xlsx',
            description: 'CoT 4단계 추론 단계별 프롬프트 구조 및 출력 예시',
            sampleHeaders: ['Step_Number', 'Step_Objective', 'Prompt_Segment', 'Expected_Intermediate_Output'],
            sampleRows: [
              ['Step 1', 'Text Normalization', 'Remove greetings, isolate machine mentions', 'Normalized String'],
              ['Step 2', 'Entity Extraction', 'Identify Part Name, Downtime Minutes', 'Key-Value Dict']
            ]
          },
          {
            name: 'Extraction_Accuracy_Evaluation.csv',
            size: '410 KB',
            type: 'csv',
            description: '일괄 단발 프롬프트 vs 단계별 CoT 프롬프트 추출 정확도',
            sampleHeaders: ['Entity_Type', 'Direct_Prompt_Recall', 'StepByStep_CoT_Recall', 'F1_Score_Diff'],
            sampleRows: [
              ['Part_Name', 72.4, 96.8, '+24.4%p'],
              ['Downtime_Minutes', 81.0, 98.2, '+17.2%p']
            ]
          }
        ]
      },
      {
        id: '8-4',
        code: '8-4',
        title: '오류 해결(디버깅) 프롬프팅',
        keyword: '에러 로그 (Error Log)',
        scenario: '데이터 파이프라인 실행 중 발생하는 복잡한 에러(Traceback)를 LLM에 전달하여 디버깅할 때, 사용자가 "에러 나는데 고쳐줘"라고만 입력하면 LLM이 실행 환경(파이썬 버전, 라이브러리 버전, 데이터 형태)을 몰라 잘못된 코드를 제안합니다. 에러 해결 프롬프트에 1) 전체 Traceback 에러 로그 전문, 2) 실패한 소스 코드 블록, 3) 사용된 데이터프레임의 df.info() 및 head() 스키마, 4) 가상환경 라이브러리 버전을 템플릿 형태로 자동 첨부하여 단 한 번의 프롬프트 질의로 근본 원인과 수정 코드를 도출하는 디버깅 프롬프트를 구성하시오.',
        files: [
          {
            name: 'Pipeline_Traceback_Collection.csv',
            size: '1.9 MB',
            type: 'csv',
            description: '현업 파이프라인에서 발생한 실제 파이썬 에러 로그 모음',
            sampleHeaders: ['Incident_No', 'Error_Class', 'Traceback_Snippet', 'Failed_Module'],
            sampleRows: [
              ['ERR-101', 'ValueError', "ValueError: Length of values (12) does not match length of index (10)", 'data_merge.py'],
              ['ERR-102', 'ZeroDivisionError', "ZeroDivisionError: division by zero in calculate_kpi", 'metrics.py']
            ]
          },
          {
            name: 'Debugging_Prompt_Template.xlsx',
            size: '530 KB',
            type: 'xlsx',
            description: '에러 로그 역공학 디버깅 프롬프트 4대 필수 섹션 가이드',
            sampleHeaders: ['Section_Tag', 'Content_Description', 'Automated_Script_Helper'],
            sampleRows: [
              ['[ENVIRONMENT]', 'Python version, OS, Pip freeze list', 'platform.platform()'],
              ['[DATA_PROFILE]', 'df.dtypes, df.shape, sample null counts', 'df.info() string']
            ]
          },
          {
            name: 'Fix_Turnaround_Time_Log.csv',
            size: '340 KB',
            type: 'csv',
            description: '단순 에러 입력 vs 구조화 디버깅 템플릿 해결 소요 시간 비교',
            sampleHeaders: ['Method', 'Avg_Interaction_Turns', 'Resolution_Time_min', 'First_Shot_Success_Pct'],
            sampleRows: [
              ['Unstructured Asking', 4.8, 42.5, 22.0],
              ['Structured Error Log Template', 1.2, 5.8, 89.5]
            ]
          }
        ]
      },
      {
        id: '8-5',
        code: '8-5',
        title: '현업 자동화 템플릿 구축',
        keyword: '반복 스크립트 (Automation Script)',
        scenario: '매주 월요일마다 각 공장에서 수신되는 엑셀 실적 파일을 취합하여 이상치를 검출하고, 관리도 이미지를 생성한 뒤 요약 리포트 워드 문서로 만들어 이메일로 발송하는 작업에 현장 담당자가 반나절을 소모하고 있습니다. 프롬프트 엔지니어링을 통해 이 전 과정을 무인 자동화할 수 있는 파이썬 반복 스크립트(Automation Script)를 생성해야 합니다. 정기 스케줄러(cron 또는 Windows Task Scheduler)와 연동 가능한 예외 처리 포함 완성형 자동화 파이썬 스크립트 템플릿을 개발하시오.',
        files: [
          {
            name: 'Weekly_Raw_Excel_Dropzone.csv',
            size: '3.1 MB',
            type: 'csv',
            description: '매주 자동 수집되는 5개 공장 실적 파일 목록 및 메타정보',
            sampleHeaders: ['File_Name', 'Upload_Timestamp', 'Plant_Source', 'Validation_Status'],
            sampleRows: [
              ['PlantA_Week41.xlsx', '2026-10-12 06:00:00', 'Plant_A', 'Valid'],
              ['PlantB_Week41.xlsx', '2026-10-12 06:05:00', 'Plant_B', 'Valid']
            ]
          },
          {
            name: 'Automation_Workflow_Spec.xlsx',
            size: '670 KB',
            type: 'xlsx',
            description: '취합-검증-분석-보고서생성-이메일발송 5단계 아키텍처',
            sampleHeaders: ['Step', 'Task_Description', 'Python_Libraries', 'Failover_Plan'],
            sampleRows: [
              ['Step 1', 'Batch File Read & Concat', 'pandas, glob', 'Log error and skip corrupt file'],
              ['Step 2', 'Email Dispatch', 'smtplib, email.mime', 'Retry 3 times then SMS alert']
            ]
          },
          {
            name: 'Automation_Script_Template.csv',
            size: '520 KB',
            type: 'csv',
            description: '스케줄러 연동용 CLI 인자 파싱 및 로깅 표준 코드 조각',
            sampleHeaders: ['Code_Snippet_Name', 'Module', 'Purpose'],
            sampleRows: [
              ['argparse_runner', 'cli_runner.py', 'Accept date arguments via command line'],
              ['rotating_logger', 'logger.py', 'Maintain 30-day rotating file logs']
            ]
          }
        ]
      }
    ]
  },
  {
    id: 9,
    name: '머신러닝 : 이론',
    englishName: 'Machine Learning : Theory',
    items: [
      {
        id: '9-1',
        code: '9-1',
        title: '머신러닝 개요',
        keyword: '학습 패러다임 (Learning Paradigm)',
        scenario: '제조 현장의 다양한 인공지능 프로젝트를 기획하는 과정에서, 엔지니어들이 지도학습(Supervised), 비지도학습(Unsupervised), 준지도학습(Semi-supervised), 강화학습(Reinforcement Learning)의 학습 패러다임(Learning Paradigm)별 적용 조건을 명확히 구별하지 못하고 있습니다. 예컨대 양품/불량 레이블이 전혀 없는 신규 라인에 무작정 지도학습 분류 모델을 요구하거나, 제어 피드백이 없는 상태에서 강화학습을 적용하려는 무리한 기획이 반복되고 있습니다. 데이터 보유 현황 및 비즈니스 목적에 부합하는 올바른 머신러닝 학습 패러다임 매핑 체계를 수립하시오.',
        files: [
          {
            name: 'Plant_AI_Project_Catalog.csv',
            size: '1.2 MB',
            type: 'csv',
            description: '현업 추진 중인 20개 머신러닝 과제 명세 및 데이터 특성',
            sampleHeaders: ['Project_ID', 'Project_Name', 'Has_Ground_Truth_Labels', 'Data_Volume'],
            sampleRows: [
              ['PRJ-01', '모터 이상 진동 사전 감지', false, '10,000,000 센서 스트림'],
              ['PRJ-02', '최종 제품 외관 결함 분류', true, '5,000장 라벨링 이미지']
            ]
          },
          {
            name: 'Paradigm_Decision_Framework.xlsx',
            size: '580 KB',
            type: 'xlsx',
            description: '목적 및 라벨 유무에 따른 학습 패러다임 선정 가이드',
            sampleHeaders: ['Label_Status', 'Goal_Type', 'Recommended_Paradigm', 'Candidate_Algorithms'],
            sampleRows: [
              ['No Labels', 'Anomaly Detection / Clustering', 'Unsupervised Learning', 'Isolation Forest, K-Means'],
              ['Fully Labeled', 'Continuous Prediction', 'Supervised Regression', 'XGBoost, Random Forest']
            ]
          },
          {
            name: 'ROI_Feasibility_Analysis.csv',
            size: '410 KB',
            type: 'csv',
            description: '패러다임별 라벨링 비용 대비 기대 효과 및 성공률 분석',
            sampleHeaders: ['Paradigm', 'Labeling_Cost_KRW', 'Expected_ROI_Pct', 'Typical_Failure_Risk'],
            sampleRows: [
              ['Supervised', '45,000,000', '+180%', 'Data drift over time'],
              ['Unsupervised', '0', '+85%', 'Subjective threshold tuning']
            ]
          }
        ]
      },
      {
        id: '9-2',
        code: '9-2',
        title: '주요 알고리즘의 이해 (회귀)',
        keyword: '선형성 (Linearity)',
        scenario: '석유화학 플랜트의 증류탑 에너지 소비량을 예측하기 위해 다중선형회귀(Multiple Linear Regression) 모델을 구축하였으나, 특정 운전 온도와 환류비(Reflux Ratio) 사이의 강한 비선형적(Non-linear) 물리 화학적 반응으로 인해 잔차(Residual)가 심각하게 왜곡되고 높은 예측 오차를 보이고 있습니다. 선형성(Linearity) 가정을 검증하기 위해 잔차 플롯 및 다항식 항(Polynomial Features) 추가 또는 비선형 회귀 모델(Support Vector Regressor, 트리 기반 회귀)과의 예측력 비교를 수행하고 모형을 고도화하시오.',
        files: [
          {
            name: 'Distillation_Energy_Data.csv',
            size: '2.4 MB',
            type: 'csv',
            description: '증류탑 온도, 압력, 환류비 및 시간당 에너지 소비량(MWh)',
            sampleHeaders: ['Timestamp', 'Temp_Top', 'Temp_Bottom', 'Reflux_Ratio', 'Energy_Consumption'],
            sampleRows: [
              ['2026-10-01 01:00', 82.4, 142.1, 3.2, 45.8],
              ['2026-10-01 02:00', 95.8, 168.4, 5.8, 88.4]
            ]
          },
          {
            name: 'Regression_Linearity_Diagnostics.xlsx',
            size: '640 KB',
            type: 'xlsx',
            description: '선형 모델 잔차 검정(Durbin-Watson, Ramsey RESET) 결과',
            sampleHeaders: ['Diagnostic_Test', 'Test_Statistic', 'P_Value', 'Linearity_Verdict'],
            sampleRows: [
              ['Ramsey_RESET', 18.42, 0.00002, 'Severe Non-linearity Detected']
            ]
          },
          {
            name: 'Linear_vs_Nonlinear_Comparison.csv',
            size: '490 KB',
            type: 'csv',
            description: '선형회귀 vs 다항회귀 vs XGBoost 예측 성능(RMSE, R2)',
            sampleHeaders: ['Model_Type', 'Train_R2', 'Test_R2', 'RMSE_MWh'],
            sampleRows: [
              ['Linear_Regression', 0.642, 0.588, 12.4],
              ['Polynomial_Degree_2', 0.884, 0.852, 5.8],
              ['XGBoost_Regressor', 0.945, 0.921, 3.2]
            ]
          }
        ]
      },
      {
        id: '9-3',
        code: '9-3',
        title: '주요 알고리즘의 이해 (분류)',
        keyword: '앙상블 (Ensemble)',
        scenario: '반도체 다이 소잉(Sawing) 공정의 칩 크랙 결함을 판별하기 위해 단일 결정 트리(Decision Tree)를 학습시켰으나, 훈련 데이터에 대한 과적합으로 검증 데이터 정확도가 73%로 급락하는 불안정성이 확인되었습니다. 단일 트리의 높은 분산(Variance) 문제를 극복하고 예측 안정성을 높이기 위해 배깅(Bagging) 기반의 랜덤 포레스트(Random Forest)와 부스팅(Boosting) 기반의 LightGBM 앙상블(Ensemble) 모델을 구축하고, 모델 간 편향-분산 절충(Bias-Variance Tradeoff) 개선 효과를 분석하시오.',
        files: [
          {
            name: 'Die_Crack_Defect_Features.csv',
            size: '3.8 MB',
            type: 'csv',
            description: '다이 소잉 블레이드 RPM, 진동, 절삭액 압력 및 크랙 여부',
            sampleHeaders: ['Die_ID', 'Blade_RPM', 'Vib_Amplitude', 'Fluid_Press', 'Is_Crack_Defect'],
            sampleRows: [
              ['D-0001', 32000, 0.12, 4.2, 0],
              ['D-0002', 29500, 0.84, 3.1, 1]
            ]
          },
          {
            name: 'Ensemble_Architecture_Comparison.xlsx',
            size: '710 KB',
            type: 'xlsx',
            description: '단일 트리 vs 배깅(RF) vs 부스팅(LightGBM) 비교 명세',
            sampleHeaders: ['Model', 'Ensemble_Mechanism', 'Base_Estimators', 'Test_Accuracy', 'Inference_ms'],
            sampleRows: [
              ['Decision_Tree', 'None (Single)', 1, 0.732, 0.12],
              ['Random_Forest', 'Bagging + Subspace', 100, 0.894, 2.45],
              ['LightGBM', 'Leaf-wise Boosting', 150, 0.938, 0.85]
            ]
          },
          {
            name: 'Tree_Variance_Reduction_Log.csv',
            size: '520 KB',
            type: 'csv',
            description: '트리 개수(N_estimators) 증가에 따른 예측 분산 감소 추이',
            sampleHeaders: ['N_Trees', 'Prediction_Variance', 'OOB_Error'],
            sampleRows: [
              [10, 0.048, 0.185],
              [100, 0.012, 0.074]
            ]
          }
        ]
      },
      {
        id: '9-4',
        code: '9-4',
        title: '모델 평가 지표',
        keyword: '혼동 행렬 (Positive = 불량(NG) 기준)',
        scenario: '정밀 제조 라인에서 전체 제품 중 불량률이 0.5%에 불과한 극심한 클래스 불균형(Class Imbalance) 데이터셋에서, 모든 제품을 정상(Negative)으로 판정하는 엉터리 분류기도 정확도(Accuracy)는 99.5%로 나타나는 착시 현상이 발생했습니다. Positive를 불량(NG)으로 명확히 정의한 혼동 행렬(Confusion Matrix)을 바탕으로 정밀도(Precision), 재현율(Recall, 민감도), F1-Score, ROC-AUC를 산출하고, 실제 불량을 놓치는 치명적 위험(False Negative)을 방지할 수 있는 최적의 분류 임계값(Threshold)을 결정하시오.',
        files: [
          {
            name: 'Imbalanced_Defect_Predictions.csv',
            size: '2.6 MB',
            type: 'csv',
            description: '10,000건 테스트 셋의 실제 불량 여부 및 모델 예측 확률',
            sampleHeaders: ['Item_No', 'Actual_NG', 'Predicted_Prob_NG'],
            sampleRows: [
              ['ITM-001', 0, 0.002],
              ['ITM-002', 1, 0.892],
              ['ITM-003', 0, 0.041],
              ['ITM-004', 1, 0.420]
            ]
          },
          {
            name: 'Confusion_Matrix_Threshold_Sweep.xlsx',
            size: '640 KB',
            type: 'xlsx',
            description: '임계치(0.1~0.9)별 TP, FP, FN, TN 및 F1, Recall 변화표',
            sampleHeaders: ['Threshold', 'TP', 'FP', 'FN', 'TN', 'Precision', 'Recall', 'F1_Score'],
            sampleRows: [
              [0.50, 32, 8, 18, 9942, 0.800, 0.640, 0.711],
              [0.25, 46, 24, 4, 9926, 0.657, 0.920, 0.767]
            ]
          },
          {
            name: 'Cost_Matrix_By_Error_Type.csv',
            size: '390 KB',
            type: 'csv',
            description: 'False Positive(오검출 재검사비용) vs False Negative(고객유출 클레임비용)',
            sampleHeaders: ['Error_Class', 'Unit_Cost_KRW', 'Business_Consequence'],
            sampleRows: [
              ['False Positive (Type I)', 5000, '단순 재검사 인건비 발생'],
              ['False Negative (Type II)', 15000000, '완성차 조립 라인 정지 및 리콜']
            ]
          }
        ]
      },
      {
        id: '9-5',
        code: '9-5',
        title: '과적합과 규제',
        keyword: '편향-분산 트레이드오프 (Bias-Variance Tradeoff)',
        scenario: '복잡한 화학 반응 수율을 예측하기 위해 10차 다항식 모델과 깊은 트리를 학습시켰더니, 훈련 데이터에 대해서는 손실(Loss)이 0에 수렴하지만 검증 데이터에서는 오차가 폭발하는 전형적인 과적합(Overfitting)과 높은 분산(High Variance) 문제가 발생했습니다. 편향-분산 트레이드오프(Bias-Variance Tradeoff) 원리를 기반으로 모델 복잡도를 제어하고, L1(Lasso, 변수 선택) 및 L2(Ridge, 가중치 감쇠) 규제(Regularization) 하이퍼파라미터(λ / alpha)를 튜닝하여 일반화 성능을 극대화하는 방안을 수립하시오.',
        files: [
          {
            name: 'Overfitting_Train_Val_Loss.csv',
            size: '1.5 MB',
            type: 'csv',
            description: '모델 복잡도(차수/트리깊이)별 Train Loss 및 Val Loss 추이',
            sampleHeaders: ['Model_Degree', 'Train_MSE', 'Val_MSE', 'Bias_Estimate', 'Variance_Estimate'],
            sampleRows: [
              [1, 4.25, 4.31, 'High', 'Low'],
              [4, 1.12, 1.18, 'Optimal', 'Optimal'],
              [10, 0.02, 18.45, 'Low', 'Extremely High']
            ]
          },
          {
            name: 'L1_L2_Regularization_Path.xlsx',
            size: '610 KB',
            type: 'xlsx',
            description: 'Alpha 값에 따른 계수 수렴 궤적(Lasso vs Ridge Path)',
            sampleHeaders: ['Alpha', 'L1_Zero_Coeffs_Count', 'Ridge_L2_Norm', 'Validation_Score'],
            sampleRows: [
              [0.001, 0, 14.8, 0.81],
              [0.050, 4, 6.2, 0.91],
              [1.000, 11, 1.1, 0.72]
            ]
          },
          {
            name: 'Learning_Curve_Samples.csv',
            size: '480 KB',
            type: 'csv',
            description: '표본 크기(N) 증가에 따른 훈련/검증 오차 수렴 곡선',
            sampleHeaders: ['Sample_Size', 'Train_Error', 'Validation_Error'],
            sampleRows: [
              [50, 0.12, 8.45],
              [500, 0.95, 1.42]
            ]
          }
        ]
      }
    ]
  },
  {
    id: 10,
    name: '머신러닝 : 탐색적 데이터분석 (EDA)',
    englishName: 'Machine Learning : Exploratory Data Analysis (EDA)',
    items: [
      {
        id: '10-1',
        code: '10-1',
        title: '데이터 구조 파악과 요약',
        keyword: '데이터 윤곽 (Data Shape)',
        scenario: '신규 스마트 팩토리 사물인터넷(IoT) 플랫폼에서 통합 적재된 원천 데이터셋을 머신러닝에 투입하기 전, 전체 데이터의 형상(Data Shape, 행/열 크기), 컬럼별 자료형, 고유값(Unique Values) 개수, 결측치 비율 등을 체계적으로 파악하는 전주기 프로파일링이 결여되어 있습니다. 1,000만 행에 달하는 거대 데이터셋에서 info(), describe(), 누적 분포 요약 지표를 산출하여 데이터의 전체적인 윤곽과 통계적 이상 징후를 신속하게 포착하는 EDA 표준 체크리스트를 완성하시오.',
        files: [
          {
            name: 'IoT_Factory_Raw_Profile.csv',
            size: '4.8 MB',
            type: 'csv',
            description: '50개 센서 피처가 포함된 대규모 IoT 원천 스키마',
            sampleHeaders: ['Device_UUID', 'Timestamp', 'F01_Vib', 'F02_Current', 'Target_Class'],
            sampleRows: [
              ['DEV-A1', '2026-10-14 00:00:01', 0.24, 14.2, 'Normal'],
              ['DEV-A1', '2026-10-14 00:00:02', 0.25, 14.1, 'Normal']
            ]
          },
          {
            name: 'Data_Shape_Summary_Card.xlsx',
            size: '540 KB',
            type: 'xlsx',
            description: '행/열 수, 메모리 점유, 결측 컬럼 수, 카디널리티 요약 카드',
            sampleHeaders: ['Attribute', 'Value', 'Assessment_Flag'],
            sampleRows: [
              ['Total_Rows', '10,000,000', 'Big Data'],
              ['Total_Columns', '52', 'Moderate Dimension'],
              ['Missing_Columns', '8', 'Requires Imputation']
            ]
          },
          {
            name: 'Descriptive_Quantiles_Report.csv',
            size: '890 KB',
            type: 'csv',
            description: '피처별 mean, std, min, 25%, 50%, 75%, max 지표 요약',
            sampleHeaders: ['Feature_Name', 'Mean', 'Std', 'Min', 'Median', 'Max'],
            sampleRows: [
              ['F01_Vib', 0.31, 0.12, 0.01, 0.28, 4.82],
              ['F02_Current', 15.2, 2.8, 0.0, 14.9, 38.4]
            ]
          }
        ]
      },
      {
        id: '10-2',
        code: '10-2',
        title: '단일 변수 및 이변량 분석',
        keyword: '상관관계 (Correlation)',
        scenario: '에어컨 컴프레서 신뢰성 시험 데이터에서 수명(MTBF)에 영향을 미치는 핵심 변수를 탐색하기 위해 단일 변수의 왜도/첨도 검토와 변수 간 피어슨 및 스피어만 순위 상관계수 행렬을 계산했습니다. 분석 결과 모터 고정자 온도와 작동 주파수 간의 상관계수가 0.94로 극심한 다중공선성(Multicollinearity) 위험을 내포하고 있으며, 일부 변수는 타깃 변수와 비선형 U자형 관계를 띠고 있어 선형 상관계수로는 관계가 은폐되어 있었습니다. 이변량 산점도 매트릭스와 상관 히트맵을 통해 독립 변수 간 종속성을 진단하시오.',
        files: [
          {
            name: 'Compressor_Reliability_EDA.csv',
            size: '3.1 MB',
            type: 'csv',
            description: '컴프레서 온도, 주파수, 윤활유 압력, 토크 및 수명 수치',
            sampleHeaders: ['Unit_ID', 'Stator_Temp_C', 'Frequency_Hz', 'Oil_Press_bar', 'MTBF_Hours'],
            sampleRows: [
              ['C-101', 94.2, 60.1, 3.2, 4520],
              ['C-102', 112.5, 75.4, 2.4, 1850]
            ]
          },
          {
            name: 'Correlation_Matrix_Pearson_Spearman.xlsx',
            size: '670 KB',
            type: 'xlsx',
            description: '피어슨 선형 상관계수 및 스피어만 순위 상관계수 대조표',
            sampleHeaders: ['Var_Pair', 'Pearson_R', 'Spearman_Rho', 'Relationship_Type'],
            sampleRows: [
              ['Temp vs Frequency', 0.94, 0.96, 'Linear High Collinearity'],
              ['Oil_Press vs MTBF', -0.32, -0.78, 'Monotonic Non-linear']
            ]
          },
          {
            name: 'VIF_Collinearity_Audit.csv',
            size: '410 KB',
            type: 'csv',
            description: '분산팽창지수(VIF) 산출 및 제거 대상 후보 변수 목록',
            sampleHeaders: ['Variable', 'VIF_Score', 'Action_Recommended'],
            sampleRows: [
              ['Stator_Temp_C', 14.8, 'Drop or Combine'],
              ['Frequency_Hz', 12.1, 'Drop or Combine']
            ]
          }
        ]
      },
      {
        id: '10-3',
        code: '10-3',
        title: '데이터 정제 (Cleansing)',
        keyword: '결측치 대치 (Imputation)',
        scenario: '자율주행 라이다(LiDAR) 및 레이더 융합 데이터셋에서 악천후나 전파 방해로 인해 특정 거리 측정 컬럼의 결측률이 15%에 달하고 있습니다. 결측된 데이터를 무조건 삭제할 경우 유효 주행 데이터의 40%가 손실되는 심각한 정보 손실이 발생합니다. 단순 평균/중앙값 대치는 변수의 본래 분산을 축소 왜곡시키므로, 차량 속도와 조도 센서 정보를 조건부로 활용하는 MICE(Multivariate Imputation by Chained Equations) 다중 대치법과 회귀 기반 대치 알고리즘을 적용하여 데이터 완전성을 복원하시오.',
        files: [
          {
            name: 'Autonomous_Sensor_Dirty.csv',
            size: '3.9 MB',
            type: 'csv',
            description: '결측치 및 잡음이 포함된 자율주행 복합 센서 데이터',
            sampleHeaders: ['Frame_ID', 'Vehicle_Speed_kmh', 'Lidar_Dist_m', 'Ambient_Lux'],
            sampleRows: [
              ['FR-001', 65.4, 42.1, 12000],
              ['FR-002', 65.8, null, 12100],
              ['FR-003', 70.2, null, 450]
            ]
          },
          {
            name: 'Imputation_Quality_Evaluation.xlsx',
            size: '720 KB',
            type: 'xlsx',
            description: '평균대치 vs KNN(k=5) vs MICE 대치 후 원래 분포 보존도',
            sampleHeaders: ['Imputation_Method', 'Variance_Retention_Pct', 'Wasserstein_Dist', 'Runtime_sec'],
            sampleRows: [
              ['Mean_Impute', 72.4, 1.45, 0.1],
              ['KNN_K5', 94.8, 0.28, 4.2],
              ['MICE_Iterative', 98.6, 0.08, 12.5]
            ]
          },
          {
            name: 'Missingness_Pattern_Matrix.csv',
            size: '520 KB',
            type: 'csv',
            description: 'MCAR, MAR, MNAR 검정을 위한 결측 패턴 매트릭스',
            sampleHeaders: ['Pattern_ID', 'Lidar_Missing', 'Lux_Missing', 'Frequency_Count'],
            sampleRows: [
              ['P1', 1, 0, 1420],
              ['P2', 0, 0, 8580]
            ]
          }
        ]
      },
      {
        id: '10-4',
        code: '10-4',
        title: '데이터 스케일링과 인코딩',
        keyword: '정규화 (Normalization)',
        scenario: '신용평가 및 이상 거래 탐지(FDS) 모델을 개발하는 과정에서, 연소득(수천만~수억 원)과 나이(20~80세), 연체 횟수(0~5회) 간의 스케일 편차가 극심하여 경사하강법 기반 신경망과 거리 기반 k-NN 모델의 학습이 전혀 수렴하지 않고 있습니다. 또한 직업 범주(Category) 컬럼을 단순 레이블 인코딩(Label Encoding)하여 임의의 서열 순서 왜곡이 발생했습니다. StandardScaler, MinMaxScaler, RobustScaler의 이상치 민감도를 비교하고 원-핫 인코딩(One-Hot) 및 타깃 인코딩을 적재적소에 적용하시오.',
        files: [
          {
            name: 'Credit_FDS_Unscaled.csv',
            size: '2.9 MB',
            type: 'csv',
            description: '연소득, 나이, 자산규모, 직업군, 이상 거래 라벨 데이터',
            sampleHeaders: ['Cust_ID', 'Annual_Income_KRW', 'Age', 'Job_Category', 'Is_Fraud'],
            sampleRows: [
              ['C-001', 85000000, 38, 'Engineer', 0],
              ['C-002', 1200000000, 52, 'Executive', 1]
            ]
          },
          {
            name: 'Scaling_Encoding_Benchmark.xlsx',
            size: '610 KB',
            type: 'xlsx',
            description: '스케일러별 경사하강 수렴 속도 및 이상치 왜곡 지수',
            sampleHeaders: ['Scaler_Name', 'Outlier_Robustness', 'Gradient_Descent_Epochs', 'AUC_Score'],
            sampleRows: [
              ['StandardScaler', 'Low (Distorted by extreme income)', 140, 0.84],
              ['RobustScaler', 'High (Uses Median & IQR)', 45, 0.92]
            ]
          },
          {
            name: 'Category_Encoding_Cardinality.csv',
            size: '430 KB',
            type: 'csv',
            description: '고카디널리티 범주형 변수의 Target Encoding 적용 결과',
            sampleHeaders: ['Job_Category', 'Count', 'Fraud_Ratio', 'Target_Encoded_Val'],
            sampleRows: [
              ['Engineer', 4500, 0.012, 0.012],
              ['Freelancer', 1200, 0.048, 0.048]
            ]
          }
        ]
      },
      {
        id: '10-5',
        code: '10-5',
        title: '파생 변수 생성 (Feature Engineering)',
        keyword: '특성 추출 (Feature Extraction)',
        scenario: '고객 이탈(Churn) 예측 모델에서 원본 트랜잭션 데이터(결제 일시, 금액)만으로는 모델의 판별력이 F1-score 0.65 수준에서 정체되어 있습니다. 도메인 지식을 결합하여 고객별 최근 결제일 경과일수(Recency), 결제 빈도(Frequency), 누적 결제액(Monetary)의 RFM 파생 변수와 주중/주말 결제 비율, 최근 30일 대비 이전 90일 소비 증감율(Trend) 파생 특성을 신규 추출(Feature Extraction)하여 모델의 예측 변별력을 획기적으로 향상시키는 피처 엔지니어링 전략을 설계하시오.',
        files: [
          {
            name: 'Customer_Transactions_Log.csv',
            size: '4.2 MB',
            type: 'csv',
            description: '고객별 1년간 일별 결제 트랜잭션 원장 데이터',
            sampleHeaders: ['Cust_ID', 'Trans_Timestamp', 'Amount_KRW', 'Is_Weekend'],
            sampleRows: [
              ['USR-101', '2026-08-12 14:20:00', 45000, 0],
              ['USR-101', '2026-09-30 19:10:00', 120000, 1]
            ]
          },
          {
            name: 'Engineered_Features_Catalog.xlsx',
            size: '740 KB',
            type: 'xlsx',
            description: 'RFM 및 트렌드 파생 변수 15종 수식 및 생성 로직 명세',
            sampleHeaders: ['Feature_Code', 'Feature_Formula', 'Domain_Rationale', 'Correlation_With_Churn'],
            sampleRows: [
              ['FE_RECENCY', 'Current_Date - Last_Trans_Date', 'Inactivity indicates churn', 0.54],
              ['FE_AMT_TREND', 'Avg_Amt_Last30D / Avg_Amt_Prev90D', 'Spending drop indicates churn', -0.61]
            ]
          },
          {
            name: 'Model_Performance_Uplift.csv',
            size: '480 KB',
            type: 'csv',
            description: '파생 변수 추가 전후의 머신러닝 성능 지표 비교표',
            sampleHeaders: ['Feature_Set', 'F1_Score', 'ROC_AUC', 'Top10_Feature_Importance'],
            sampleRows: [
              ['Raw_Features_Only', 0.652, 0.710, 'Amount, Age'],
              ['Engineered_RFM_Features', 0.884, 0.932, 'FE_RECENCY, FE_AMT_TREND']
            ]
          }
        ]
      }
    ]
  },
  {
    id: 11,
    name: '머신러닝 : 모델링 및 강화',
    englishName: 'Machine Learning : Modeling & Tuning',
    items: [
      {
        id: '11-1',
        code: '11-1',
        title: '데이터 분할과 베이스라인 구축',
        keyword: '과적합 방지 (Train-Test Split)',
        scenario: '시계열 주가 및 수요 예측 모델을 개발하면서 무작위 무차별 추출(random shuffle)로 훈련/테스트 세트를 분할하여, 미래 시점의 정보가 과거 훈련 세트로 유출되는 데이터 누수(Data Leakage)가 발생했습니다. 이로 인해 백테스트에서는 경이로운 수익률을 보였으나 실전 배포 후 막대한 손실을 기록했습니다. 시계열 순서를 보존하는 TimeSeriesSplit과 층화 분할(Stratified Split)을 적용하여 데이터 누수를 원천 차단하고, 가장 단순한 규칙 기반 베이스라인(Baseline) 모델을 먼저 구축하여 모델의 실질적 성능 개선도를 측정하시오.',
        files: [
          {
            name: 'Demand_Forecasting_Timeseries.csv',
            size: '3.4 MB',
            type: 'csv',
            description: '3년간 일별 제품 수요량 및 가격, 마케팅 지수 시계열',
            sampleHeaders: ['Date', 'Demand_Units', 'Unit_Price', 'Promo_Spend'],
            sampleRows: [
              ['2024-01-01', 1240, 15000, 200000],
              ['2024-01-02', 1180, 15000, 150000]
            ]
          },
          {
            name: 'Split_Leakage_Audit_Report.xlsx',
            size: '610 KB',
            type: 'xlsx',
            description: 'Random Split vs TimeSeriesSplit 성능 착시 검증표',
            sampleHeaders: ['Split_Method', 'Backtest_R2', 'Live_Deployment_R2', 'Leakage_Status'],
            sampleRows: [
              ['Random_Shuffle', 0.98, 0.32, 'Critical Data Leakage'],
              ['TimeSeries_Rolling', 0.74, 0.73, 'Robust & Leakage-Free']
            ]
          },
          {
            name: 'Baseline_Heuristic_Comparison.csv',
            size: '420 KB',
            type: 'csv',
            description: '단순 이동평균 베이스라인 대비 머신러닝 MAE 개선율',
            sampleHeaders: ['Model', 'MAE_Units', 'Uplift_Over_Baseline'],
            sampleRows: [
              ['Naive_Yesterday_Value', 142.5, '0% (Baseline)'],
              ['Rolling_7Day_Mean', 98.4, '+30.9%'],
              ['LightGBM_Regressor', 45.2, '+68.3%']
            ]
          }
        ]
      },
      {
        id: '11-2',
        code: '11-2',
        title: '교차 검증 (Cross-Validation)',
        keyword: 'K-Fold 검증',
        scenario: '의료 영상 기반 종양 분류 모델에서 전체 데이터 표본 수가 1,200건으로 제한적인 상황에서, 단 1회의 8:2 고정 분할에만 의존하여 훈련 세트와 테스트 세트의 우연한 데이터 조성 편향으로 인해 평가 점수가 70%에서 92%까지 극단적으로 요동치는 문제가 발생했습니다. 데이터의 모든 표본이 한 번씩 검증 세트로 활용되는 5-Fold Stratified K-Fold 교차 검증을 설계하고, Fold별 성능의 평균(Mean)과 표준편차(Std)를 계산하여 모델의 진정한 일반화 안정성을 평가하시오.',
        files: [
          {
            name: 'Medical_Tumor_Samples.csv',
            size: '2.1 MB',
            type: 'csv',
            description: '1,200건 종양 조직 검사 특성치 및 양성/악성 라벨',
            sampleHeaders: ['Patient_ID', 'Cell_Radius', 'Cell_Texture', 'Malignant_Label'],
            sampleRows: [
              ['PT-001', 14.2, 20.4, 1],
              ['PT-002', 11.5, 14.8, 0]
            ]
          },
          {
            name: 'Stratified_KFold_Scores.xlsx',
            size: '560 KB',
            type: 'xlsx',
            description: 'Fold 1~5 개별 정확도, F1-Score 및 앙상블 수렴 결과',
            sampleHeaders: ['Fold', 'Train_F1', 'Val_F1', 'Precision', 'Recall'],
            sampleRows: [
              ['Fold 1', 0.94, 0.88, 0.87, 0.89],
              ['Fold 2', 0.95, 0.86, 0.85, 0.87],
              ['Fold 3', 0.93, 0.89, 0.88, 0.90],
              ['Mean +/- Std', '0.94 +/- 0.01', '0.876 +/- 0.012', 'Stable', 'Stable']
            ]
          },
          {
            name: 'Class_Ratio_Across_Folds.csv',
            size: '340 KB',
            type: 'csv',
            description: '각 Fold별 악성(1) 비율이 동일하게 유지되는지 검증한 데이터',
            sampleHeaders: ['Fold_Index', 'Malignant_Ratio', 'Benign_Ratio'],
            sampleRows: [
              ['Fold_1', 0.354, 0.646],
              ['Fold_2', 0.354, 0.646]
            ]
          }
        ]
      },
      {
        id: '11-3',
        code: '11-3',
        title: '하이퍼파라미터 튜닝',
        keyword: '파라미터 최적화 (Parameter Optimization)',
        scenario: 'XGBoost 기반 태양광 발전량 예측 모델에서 max_depth, learning_rate, n_estimators, colsample_bytree 등 탐색해야 할 하이퍼파라미터 조합이 수만 개에 달합니다. 무차별적인 그리드 탐색(GridSearchCV)을 수행했을 때 연산 시간이 72시간을 초과하여 배포 일정을 맞추지 못했습니다. 베이지안 최적화(Optuna) 또는 무작위 탐색(RandomizedSearchCV)을 도입하여 과거 탐색 이력을 바탕으로 목적 함수(Loss)를 최소화하는 유망 영역을 집중 탐색(Exploration & Exploitation)하는 고속 튜닝 파이프라인을 구축하시오.',
        files: [
          {
            name: 'Solar_Power_Features.csv',
            size: '3.6 MB',
            type: 'csv',
            description: '일사량, 기온, 습도, 풍속 및 시간대별 태양광 발전량(kW)',
            sampleHeaders: ['Timestamp', 'Irradiance_W_m2', 'Ambient_Temp', 'Power_Output_kW'],
            sampleRows: [
              ['2026-10-10 12:00', 850.4, 24.2, 485.2],
              ['2026-10-10 13:00', 890.1, 25.1, 510.8]
            ]
          },
          {
            name: 'Optuna_Tuning_Trials_History.xlsx',
            size: '810 KB',
            type: 'xlsx',
            description: 'Optuna 100회 트라이얼별 파라미터 조합 및 RMSE 수렴 기록',
            sampleHeaders: ['Trial', 'Max_Depth', 'Learning_Rate', 'Colsample', 'RMSE_Score'],
            sampleRows: [
              [1, 6, 0.10, 0.8, 14.2],
              [42, 4, 0.03, 0.6, 8.1]
            ]
          },
          {
            name: 'Grid_vs_Optuna_Benchmark.csv',
            size: '380 KB',
            type: 'csv',
            description: 'GridSearch 대비 베이지안 최적화의 시간 단축률 및 성능 비교',
            sampleHeaders: ['Tuning_Method', 'Total_Runtime_min', 'Best_RMSE', 'Trials_Count'],
            sampleRows: [
              ['GridSearchCV', 4320, 8.5, 2400],
              ['Optuna (Bayesian)', 180, 7.9, 100]
            ]
          }
        ]
      },
      {
        id: '11-4',
        code: '11-4',
        title: '앙상블 기법 적용',
        keyword: '부스팅 (Boosting)',
        scenario: '신용카드 부정 사용 탐지(Fraud Detection) 시스템에서 단일 모델의 한계를 극복하기 위해 그래디언트 부스팅(Gradient Boosting), XGBoost, LightGBM, CatBoost의 성능을 상호 벤치마킹하고 있습니다. 부스팅 알고리즘이 이전 트리가 범한 잔차 오차(Residual Error)를 다음 트리가 단계적으로 학습하여 보정해 나가는 수학적 메커니즘을 규명하고, 범주형 변수가 많은 결제 도메인 특성에 맞춘 손실 함수 가중치 설정(scale_pos_weight) 및 최적 앙상블 블렌딩(Blending) 구조를 도출하시오.',
        files: [
          {
            name: 'Credit_Fraud_Boosting_Benchmark.csv',
            size: '4.1 MB',
            type: 'csv',
            description: '부스팅 알고리즘별 훈련 속도, 메모리 점유, AUC 점수',
            sampleHeaders: ['Model_Name', 'Train_Time_sec', 'Memory_MB', 'ROC_AUC', 'PR_AUC'],
            sampleRows: [
              ['XGBoost', 45.2, 1200, 0.942, 0.812],
              ['LightGBM', 8.4, 380, 0.945, 0.825],
              ['CatBoost', 62.0, 1500, 0.948, 0.838]
            ]
          },
          {
            name: 'Residual_Boosting_Iterations.xlsx',
            size: '690 KB',
            type: 'xlsx',
            description: '부스팅 1~50 라운드별 잔차 학습 진행도 및 오차 감쇄표',
            sampleHeaders: ['Iteration', 'Pseudo_Residual_Norm', 'Train_Loss', 'Val_Loss'],
            sampleRows: [
              [1, 142.5, 0.693, 0.694],
              [10, 48.2, 0.285, 0.310],
              [50, 8.1, 0.082, 0.124]
            ]
          },
          {
            name: 'Ensemble_Blending_Weights.csv',
            size: '410 KB',
            type: 'csv',
            description: 'LightGBM(0.5) + CatBoost(0.3) + RF(0.2) 최적 가중 앙상블',
            sampleHeaders: ['Ensemble_Strategy', 'Test_AUC', 'False_Alert_Reduction_Pct'],
            sampleRows: [
              ['Simple Average', 0.946, '-12%'],
              ['Weighted Blending', 0.954, '-28%']
            ]
          }
        ]
      },
      {
        id: '11-5',
        code: '11-5',
        title: '최종 결과 해석',
        keyword: '특성 중요도 (Feature Importance)',
        scenario: '고로(Blast Furnace) 용선 온도 예측 머신러닝 모델이 현장에 배포되었으나, 현장 오퍼레이터들은 모델의 예측 근거를 이해하지 못해 추천치를 신뢰하지 않고 수동 제어를 고수하고 있습니다. 트리 기반 모델의 불순도 감소(MDI) 특성 중요도가 고카디널리티 변수를 과대평가하는 왜곡을 극복하기 위해, 게임 이론 기반의 SHAP(Shapley Additive exPlanations) 값을 산출하여 개별 예측 건마다 어떤 변수가 온도를 몇 도 올리거나 내리는 데 기여했는지 설명 가능한 AI(XAI) 리포트를 완성하시오.',
        files: [
          {
            name: 'Furnace_Temp_Predictions.csv',
            size: '2.8 MB',
            type: 'csv',
            description: '용선 실제 온도, 모델 예측 온도, 12개 제어 변수 데이터',
            sampleHeaders: ['Tapping_ID', 'Actual_Temp_C', 'Pred_Temp_C', 'Oxygen_Flow', 'Coke_Rate'],
            sampleRows: [
              ['TAP-101', 1510, 1508, 12000, 480],
              ['TAP-102', 1485, 1489, 10500, 460]
            ]
          },
          {
            name: 'SHAP_Value_Decomposition.xlsx',
            size: '830 KB',
            type: 'xlsx',
            description: '개별 예측 건별 Base Value 대비 12개 피처의 SHAP 기여도',
            sampleHeaders: ['Feature_Name', 'Feature_Value', 'SHAP_Value_C', 'Contribution_Direction'],
            sampleRows: [
              ['Oxygen_Flow', 12000, +14.2, 'Heated'],
              ['Coke_Rate', 480, +8.5, 'Heated'],
              ['Moisture_Content', 8.2, -12.4, 'Cooled']
            ]
          },
          {
            name: 'MDI_vs_Permutation_vs_SHAP.csv',
            size: '520 KB',
            type: 'csv',
            description: 'MDI 중요도 vs 순열 중요도 vs SHAP 절대평균 중요도 순위',
            sampleHeaders: ['Feature', 'MDI_Rank', 'Permutation_Rank', 'SHAP_Rank'],
            sampleRows: [
              ['Oxygen_Flow', 1, 1, 1],
              ['Coke_Rate', 3, 2, 2],
              ['Random_Noise_Feature', 2, 12, 12]
            ]
          }
        ]
      }
    ]
  },
  {
    id: 12,
    name: 'AI Automation',
    englishName: 'AI Automation Pipeline',
    items: [
      {
        id: '12-1',
        code: '12-1',
        title: '자동화 파이프라인 설계',
        keyword: 'End-to-End 아키텍처',
        scenario: '정유 공장의 유류 누출 감지 시스템이 데이터 수집(CCTV/열화상), 전처리, AI 비전 추론, 이상 알림 단계가 각각 개별 스크립트로 분절되어 수동 실행되고 있어 사고 발생 시 골든타임(5분 이내) 대응이 불가능합니다. 원천 센서 스트림 인제스천부터 모델 추론, 알림, 대시보드 업데이트까지 사람의 개입 없이 유기적으로 동작하는 무중단 End-to-End 아키텍처를 설계하고, 파이프라인 각 단계의 장애 발생 시 데이터 유실을 방지하는 메시지 브로커(Kafka/RabbitMQ) 연계 방안을 수립하시오.',
        files: [
          {
            name: 'Leak_Detection_Telemetry_Stream.csv',
            size: '3.9 MB',
            type: 'csv',
            description: '열화상 픽셀 온도 분포 및 가스 누출 센서 시계열 스트림',
            sampleHeaders: ['Timestamp', 'Camera_ID', 'Max_Thermal_C', 'Gas_PPM', 'Is_Leak_Event'],
            sampleRows: [
              ['2026-10-13 14:00:01', 'CAM-01', 42.1, 12.0, 0],
              ['2026-10-13 14:00:02', 'CAM-01', 89.5, 450.0, 1]
            ]
          },
          {
            name: 'End_to_End_Pipeline_Blueprint.xlsx',
            size: '720 KB',
            type: 'xlsx',
            description: '데이터 수집-적재-추론-알림 단계별 SLA 및 장애 복구 명세',
            sampleHeaders: ['Pipeline_Stage', 'Tech_Stack', 'Target_Latency_ms', 'Failover_Mechanism'],
            sampleRows: [
              ['Ingestion', 'Kafka Consumer', 50, 'Dead Letter Queue'],
              ['AI Inference', 'ONNX Runtime GPU', 120, 'Fallback CPU Instance']
            ]
          },
          {
            name: 'Pipeline_Latency_Log.csv',
            size: '480 KB',
            type: 'csv',
            description: '엔드투엔드 처리 구간별 병목 시간(Latency) 프로파일링',
            sampleHeaders: ['Stage', 'Mean_Duration_ms', 'P99_Duration_ms'],
            sampleRows: [
              ['Capture', 15.2, 28.0],
              ['Inference', 84.5, 112.0],
              ['Alert', 22.0, 45.0]
            ]
          }
        ]
      },
      {
        id: '12-2',
        code: '12-2',
        title: '외부 데이터 연동 기초',
        keyword: 'API 연동 (API Integration)',
        scenario: '스마트 에너지 빌딩 관리 시스템(BEMS)에서 실내 냉난방 부하를 최적화하기 위해 기상청 오픈 API로부터 실시간 외부 기온, 습도, 자외선 지수 데이터를 실시간 연동하고 있습니다. 그러나 외부 API 서버의 간헐적 타임아웃(HTTP 504)과 호출 제한(Rate Limit Exceeded, 429) 에러로 인해 전체 파이프라인 프로세스가 비정상 종료되는 사태가 빈번합니다. 지수 백오프(Exponential Backoff) 재시도 로직과 인메모리 캐싱(TTL 설정), 안전한 토큰 인증 헤더 관리를 포함한 견고한 API 연동 모듈을 구현하시오.',
        files: [
          {
            name: 'Weather_API_Response_Sample.csv',
            size: '1.4 MB',
            type: 'csv',
            description: '기상청 API JSON 응답 페이로드를 테이블화한 데이터',
            sampleHeaders: ['Request_Time', 'Station_ID', 'Outdoor_Temp_C', 'Humidity_Pct', 'HTTP_Status'],
            sampleRows: [
              ['2026-10-13 10:00', 'STN-108', 21.4, 55.0, 200],
              ['2026-10-13 10:01', 'STN-108', null, null, 504]
            ]
          },
          {
            name: 'API_Resilience_Strategy.xlsx',
            size: '590 KB',
            type: 'xlsx',
            description: '재시도 횟수(Max 3회), 백오프 계수, 서킷 브레이커 설정표',
            sampleHeaders: ['Error_Code', 'Strategy', 'Initial_Delay_sec', 'Max_Delay_sec', 'Circuit_Breaker'],
            sampleRows: [
              ['429 Too Many Requests', 'Rate Limit Queueing', 2.0, 30.0, 'Open if 5 consecutive'],
              ['504 Gateway Timeout', 'Exponential Backoff', 1.0, 16.0, 'Open if 3 consecutive']
            ]
          },
          {
            name: 'API_Call_Volume_Audit.csv',
            size: '420 KB',
            type: 'csv',
            description: '시간대별 API 호출 쿼터 소진량 및 캐시 히트율(Cache Hit)',
            sampleHeaders: ['Hour', 'API_Calls_Count', 'Cache_Hits_Count', 'Quota_Remaining'],
            sampleRows: [
              ['09:00', 450, 2100, 9550],
              ['10:00', 520, 2400, 9030]
            ]
          }
        ]
      },
      {
        id: '12-3',
        code: '12-3',
        title: '스케줄링 도구 적용',
        keyword: '배치 작업 (Batch Processing)',
        scenario: '글로벌 물류 허브에서 매일 심야(02:00)에 50만 건의 배송 경로를 재최적화하는 대규모 배치 작업(Batch Processing)을 실행하고 있습니다. 현재는 단순 크론(Cron) 명령어로 실행되어 이전 작업이 미처 끝나지 않았음에도 다음 작업이 중복 기동되어 메모리 고갈로 서버가 다운되거나, 작업 실패 시 담당자에게 아무런 알림도 없이 누락되는 치명적 문제가 있습니다. Apache Airflow 기반의 DAG(Directed Acyclic Graph) 작업 스케줄링을 도입하여 태스크 의존성 관리, 동시 실행 방지, 슬랙 장애 알림 체계를 구축하시오.',
        files: [
          {
            name: 'Batch_Job_Execution_History.csv',
            size: '2.5 MB',
            type: 'csv',
            description: '최근 60일간 심야 배치 작업 시작/종료 시간 및 소요 시간',
            sampleHeaders: ['Job_ID', 'Start_Time', 'End_Time', 'Duration_min', 'Final_Status'],
            sampleRows: [
              ['BATCH-1001', '2026-10-01 02:00', '2026-10-01 02:45', 45, 'SUCCESS'],
              ['BATCH-1002', '2026-10-02 02:00', '2026-10-02 04:15', 135, 'TIMEOUT_FAIL']
            ]
          },
          {
            name: 'Airflow_DAG_Task_Tree.xlsx',
            size: '640 KB',
            type: 'xlsx',
            description: 'DAG 태스크 노드 간 선후행 의존성, 타임아웃, 재시도 명세',
            sampleHeaders: ['Task_ID', 'Upstream_Task', 'Max_Retries', 'Retry_Delay_min', 'Execution_Timeout'],
            sampleRows: [
              ['extract_orders', 'None', 3, 5, '30m'],
              ['run_vrp_solver', 'extract_orders', 1, 10, '90m'],
              ['notify_slack', 'run_vrp_solver', 2, 2, '5m']
            ]
          },
          {
            name: 'Server_Resource_Spike_Log.csv',
            size: '510 KB',
            type: 'csv',
            description: '배치 중복 기동 시 CPU/RAM 급등 및 OOM 킬러 발동 로그',
            sampleHeaders: ['Timestamp', 'CPU_Pct', 'RAM_Used_GB', 'OOM_Triggered'],
            sampleRows: [
              ['03:15:00', 98.4, 62.4, 'No'],
              ['03:16:00', 99.8, 64.0, 'YES (Process Killed)']
            ]
          }
        ]
      },
      {
        id: '12-4',
        code: '12-4',
        title: '자동화된 알림 시스템',
        keyword: '트리거 (Trigger)',
        scenario: '전력 변전소 고전압 변압기의 권선 온도와 가스 압력이 위험 임계치에 도달했을 때, 담당자에게 발송되는 알림 시스템이 단순 1회성 이메일로만 구성되어 있어 야간 근무자가 이를 확인하지 못해 대형 정전 사고로 이어질 뻔했습니다. 위험 등급별(Warning, Critical, Emergency) 차등 트리거(Trigger) 규칙을 수립하고, 위험 수위에 따라 슬랙(Slack) 웹훅, SMS 문자, 긴급 자동 음성 전화(TTS IVR)로 자동 에스컬레이션되는 다채널 실시간 능동형 알림 파이프라인을 구축하시오.',
        files: [
          {
            name: 'Substation_Alarm_Events.csv',
            size: '1.8 MB',
            type: 'csv',
            description: '변압기 이상 신호 발생 이력 및 조치 완료 시간',
            sampleHeaders: ['Event_ID', 'Transformer_ID', 'Winding_Temp_C', 'Gas_Press_kPa', 'Severity'],
            sampleRows: [
              ['EVT-501', 'TR-01', 98.5, 145, 'CRITICAL'],
              ['EVT-502', 'TR-04', 85.0, 110, 'WARNING']
            ]
          },
          {
            name: 'Notification_Escalation_Rules.xlsx',
            size: '580 KB',
            type: 'xlsx',
            description: '단계별 알림 채널(Slack, SMS, Call) 및 반응 지연 트리거',
            sampleHeaders: ['Severity_Level', 'Immediate_Channel', 'Escalation_After_min', 'Target_Recipient'],
            sampleRows: [
              ['WARNING', 'Slack Channel', 30, 'Duty Engineer'],
              ['CRITICAL', 'Slack + SMS', 5, 'Plant Manager'],
              ['EMERGENCY', 'Auto Call + Siren', 0, 'Head of Operations']
            ]
          },
          {
            name: 'Delivery_Success_Rate_Log.csv',
            size: '390 KB',
            type: 'csv',
            description: '채널별 알림 도달 소요 시간 및 수신 확인(Ack) 응답률',
            sampleHeaders: ['Channel', 'Mean_Delivery_sec', 'Ack_Response_Rate_Pct'],
            sampleRows: [
              ['Email', 48.0, 42.0],
              ['Slack_Webhook', 1.2, 88.5],
              ['SMS', 3.5, 96.0]
            ]
          }
        ]
      },
      {
        id: '12-5',
        code: '12-5',
        title: '모니터링 및 유지보수',
        keyword: '데이터 드리프트 (Data Drift)',
        scenario: '온라인 쇼핑몰 추천 AI 모델이 배포 초기에는 높은 클릭률을 기록했으나, 계절 변화와 신상품 출시로 인해 입력 데이터의 통계적 분포가 훈련 데이터와 크게 달라지는 데이터 드리프트(Data Drift) 및 개념 드리프트(Concept Drift)가 발생하여 모델의 예측 정확도가 40% 이상 하락했습니다. KS-검정(Kolmogorov-Smirnov)과 PSI(Population Stability Index) 통계량을 활용하여 입력 피처의 드리프트 발생 여부를 실시간 탐지하고, 기준치(PSI > 0.2) 초과 시 자동 재학습 파이프라인을 트리거하는 MLOps 모니터링 시스템을 구축하시오.',
        files: [
          {
            name: 'Drift_Input_Stream_Distribution.csv',
            size: '3.7 MB',
            type: 'csv',
            description: '훈련 세트 vs 최근 30일 서빙 데이터셋의 피처 분포',
            sampleHeaders: ['Feature_Name', 'Baseline_Mean', 'Current_Mean', 'KS_Statistic', 'P_Value'],
            sampleRows: [
              ['User_Age', 32.4, 32.5, 0.02, 0.84],
              ['Category_Click_Rate', 0.14, 0.38, 0.45, 0.00001]
            ]
          },
          {
            name: 'PSI_Stability_Index_Sheet.xlsx',
            size: '620 KB',
            type: 'xlsx',
            description: '피처별 10개 구간 빈도 비교 및 PSI 지표 산출서',
            sampleHeaders: ['Feature', 'PSI_Value', 'Drift_Level', 'Action_Required'],
            sampleRows: [
              ['Category_Click_Rate', 0.385, 'Significant Drift (PSI > 0.25)', 'Trigger Retraining'],
              ['Session_Duration', 0.042, 'No Drift (PSI < 0.1)', 'Normal Operation']
            ]
          },
          {
            name: 'Retraining_Trigger_Audit.csv',
            size: '410 KB',
            type: 'csv',
            description: '드리프트 감지 후 모델 자동 재학습 수행 및 수율 복구 이력',
            sampleHeaders: ['Retrain_Event_ID', 'Trigger_Date', 'Pre_Retrain_F1', 'Post_Retrain_F1'],
            sampleRows: [
              ['RT-101', '2026-10-01', 0.54, 0.89]
            ]
          }
        ]
      }
    ]
  },
  {
    id: 13,
    name: '시각화 - Tableau와 Power BI',
    englishName: 'Visualization - Tableau & Power BI',
    items: [
      {
        id: '13-1',
        code: '13-1',
        title: 'BI 도구의 이해와 데이터 연결',
        keyword: '데이터 원본 (Data Source)',
        scenario: '글로벌 리테일 유통 기업에서 Tableau 및 Power BI를 도입하여 전사 영업 대시보드를 구축하고자 합니다. 그러나 ERP(오라클), CRM(세일즈포스), 웹로그(구글 빅쿼리)의 데이터 원본(Data Source)들이 서로 다른 프로토콜과 갱신 주기로 운영되어 일일 리포트 작성 시마다 수작업 다운로드와 병합에 수시간이 소모되고 있습니다. 라이브 연결(Live Connection)과 인메모리 추출(Extract) 방식의 장단점을 성능 및 비용 관점에서 비교 평가하고, 기업 환경에 최적화된 하이브리드 데이터 원본 연결 전략을 수립하시오.',
        files: [
          {
            name: 'Enterprise_Data_Sources_Catalog.csv',
            size: '1.4 MB',
            type: 'csv',
            description: '사내 12개 주요 데이터 원본(RDBMS, Cloud, API) 메타정보',
            sampleHeaders: ['Source_ID', 'System_Name', 'DB_Engine', 'Update_Cycle', 'Volume_Rows'],
            sampleRows: [
              ['SRC-01', 'ERP_Financials', 'Oracle Exadata', 'Daily Batch (03:00)', 50000000],
              ['SRC-02', 'Web_Clickstream', 'Google BigQuery', 'Streaming Near-Realtime', 200000000]
            ]
          },
          {
            name: 'Live_vs_Extract_Evaluation.xlsx',
            size: '610 KB',
            type: 'xlsx',
            description: 'Live 연결 대 추출(Hyper/VertiPaq) 응답속도 및 부하 비교',
            sampleHeaders: ['Metric', 'Live_Connection', 'Extract_InMemory', 'Recommendation'],
            sampleRows: [
              ['Query_Latency', '4.5 sec (DB dependent)', '0.3 sec (Fast)', 'Extract for Dashboards'],
              ['Realtime_Freshness', 'Immediate (0s)', '1 Hour Schedule', 'Live for Operational Monitoring']
            ]
          },
          {
            name: 'Data_Connection_Security_Rules.csv',
            size: '420 KB',
            type: 'csv',
            description: 'OAuth 2.0 및 Kerberos 기반 SSO 데이터 연결 보안 가이드',
            sampleHeaders: ['Protocol', 'Auth_Method', 'Credential_Storage', 'Data_Governance'],
            sampleRows: [
              ['Direct_SQL', 'Service Account Key', 'Server Vault', 'Row-Level Security Enabled']
            ]
          }
        ]
      },
      {
        id: '13-2',
        code: '13-2',
        title: '데이터 전처리와 관계 모델링',
        keyword: '스타 스키마 (Star Schema)',
        scenario: 'Power BI 보고서에서 여러 부서의 매출 및 재고 테이블이 눈송이 형태(Snowflake)로 마구잡이 양방향(Bi-directional) 다대다(Many-to-Many) 관계로 얽혀 있어, 특정 슬라이서를 클릭할 때마다 쿼리가 무한 루프를 돌거나 수치가 중복 집계되는 카티시안 곱 오류가 발생하고 있습니다. 중심에 사실 테이블(Fact Table: 매출 실적, 재고 변동)을 배치하고 주변에 차원 테이블(Dimension Table: 날짜, 고객, 제품, 매장)을 단방향 1:N 관계로 배치하는 스타 스키마(Star Schema) 모델링을 설계하고 정합성을 검증하시오.',
        files: [
          {
            name: 'Sales_Inventory_Fact_Tables.csv',
            size: '4.2 MB',
            type: 'csv',
            description: '일별 거래 팩트 데이터(주문번호, 날짜키, 고객키, 금액)',
            sampleHeaders: ['Sales_Fact_ID', 'Date_Key', 'Customer_Key', 'Product_Key', 'Revenue_KRW'],
            sampleRows: [
              [9001, 20261001, 402, 108, 125000],
              [9002, 20261001, 581, 204, 340000]
            ]
          },
          {
            name: 'Star_Schema_Relationship_Spec.xlsx',
            size: '680 KB',
            type: 'xlsx',
            description: '팩트 테이블과 4대 차원 테이블 간 PK-FK 릴레이션 정의서',
            sampleHeaders: ['Table_1', 'Table_2', 'Cardinality', 'Cross_Filter_Direction', 'Security_RLS'],
            sampleRows: [
              ['Dim_Date', 'Fact_Sales', '1 to Many', 'Single (Dim -> Fact)', 'No'],
              ['Dim_Customer', 'Fact_Sales', '1 to Many', 'Single (Dim -> Fact)', 'Yes']
            ]
          },
          {
            name: 'Ambiguous_Relationship_Audit.csv',
            size: '490 KB',
            type: 'csv',
            description: '기존 스노우플레이크 모델에서 발생한 비활성 관계 및 순환 참조',
            sampleHeaders: ['Rel_ID', 'Source_Col', 'Target_Col', 'Circular_Dependency'],
            sampleRows: [
              ['REL-01', 'Store_Dim.Region', 'Customer_Dim.City', 'Detected Circular Loop']
            ]
          }
        ]
      },
      {
        id: '13-3',
        code: '13-3',
        title: '목적별 핵심 시각화 차트 구현',
        keyword: '시각화 매핑 (Visual Mapping)',
        scenario: '경영진 주간 회의용 보고서에서 데이터의 속성과 분석 목적(추세, 구성 비율, 분포, 상관관계)을 무시한 채 화려해 보인다는 이유로 원형 3D 파이 차트와 과도한 색상의 방사형 차트만 남발하여 숫자의 오독을 유발하고 있습니다. 시계열 트렌드는 라인 차트, 범주 비교는 막대 차트, 계층 구조는 트리맵, 지리적 분포는 심볼 맵으로 적절히 매핑하는 시각화 인코딩(Visual Mapping, 위치, 길이, 방향, 색상 채도) 원칙을 적용하여 정보 전달력을 극대화한 핵심 시각화 차트 세트를 구성하시오.',
        files: [
          {
            name: 'Regional_Sales_Product_Mix.csv',
            size: '2.6 MB',
            type: 'csv',
            description: '권역별, 카테고리별 분기 매출 실적 및 달성률 원천 데이터',
            sampleHeaders: ['Quarter', 'Region', 'Product_Category', 'Sales_KRW', 'Target_KRW'],
            sampleRows: [
              ['2026-Q1', 'Seoul', 'Electronics', 1420000000, 1300000000],
              ['2026-Q1', 'Busan', 'Home_Appliance', 850000000, 900000000]
            ]
          },
          {
            name: 'Visual_Encoding_Guidelines.xlsx',
            size: '590 KB',
            type: 'xlsx',
            description: '분석 목적별(비교, 추세, 분포) 권장 차트 유형 매핑 가이드',
            sampleHeaders: ['Analysis_Goal', 'Data_Types', 'Recommended_Chart', 'Forbidden_Chart'],
            sampleRows: [
              ['Trend over Time', 'Continuous Date + Numeric', 'Line / Area Chart', 'Pie Chart (Never)'],
              ['Part to Whole', 'Categorical + Proportion', 'Bar / Treemap', '3D Exploded Pie']
            ]
          },
          {
            name: 'Cognitive_Load_Test_Results.csv',
            size: '410 KB',
            type: 'csv',
            description: '사용자 50인 대상 차트 판독 소요 시간 및 정답률 실험치',
            sampleHeaders: ['Chart_Design', 'Avg_Reading_Time_sec', 'Accuracy_Pct'],
            sampleRows: [
              ['3D Pie Charts', 14.8, 58.0],
              ['Ranked Horizontal Bars', 3.2, 98.5]
            ]
          }
        ]
      },
      {
        id: '13-4',
        code: '13-4',
        title: '고급 계산식과 심화 분석',
        keyword: 'DAX 및 LOD 표현식',
        scenario: '글로벌 SaaS 솔루션 기업에서 고객 코호트 리텐션(Retention)과 전년 동기 대비 매출 성장률(YoY)을 계산해야 합니다. 단순 집계(SUM)로는 대시보드 사용자가 선택한 필터(Filter Context)와 관계없이 전체 고객을 기준으로 고정된 분모를 계산할 수 없습니다. Power BI의 CALCULATE, ALL, ALLEXCEPT를 활용한 DAX 계산식과 Tableau의 세부 수준(LOD, Level of Detail) 표현식(FIXED, INCLUDE, EXCLUDE)의 원리를 비교하고, 필터 컨텍스트를 정밀 제어하는 핵심 계산식 코드를 개발하시오.',
        files: [
          {
            name: 'SaaS_Subscription_Cohorts.csv',
            size: '3.1 MB',
            type: 'csv',
            description: '고객별 가입월, 구독 갱신월, 결제 플랜, 이탈 여부 로그',
            sampleHeaders: ['Customer_ID', 'Signup_Month', 'Activity_Month', 'MRR_USD', 'Is_Retained'],
            sampleRows: [
              ['CUST-1001', '2025-01', '2026-10', 49.0, 1],
              ['CUST-1002', '2025-01', '2025-04', 0.0, 0]
            ]
          },
          {
            name: 'DAX_vs_LOD_Formulas_Catalog.xlsx',
            size: '670 KB',
            type: 'xlsx',
            description: 'YoY성장률, 누적매출(YTD), 코호트 유지율 DAX 및 LOD 코드',
            sampleHeaders: ['Business_Metric', 'PowerBI_DAX_Formula', 'Tableau_LOD_Formula', 'Context_Behavior'],
            sampleRows: [
              ['YoY Growth', 'CALCULATE([Sales], SAMEPERIODLASTYEAR(Date[Date]))', '{ FIXED [Region] : SUM([Sales]) }', 'Bypasses local date slicer'],
              ['Customer Total', 'CALCULATE(SUM(Sales), ALLEXCEPT(Customer, ID))', '{ FIXED [Customer_ID] : SUM([Sales]) }', 'Ignores product category filters']
            ]
          },
          {
            name: 'Calculation_Performance_Profile.csv',
            size: '480 KB',
            type: 'csv',
            description: '복잡한 DAX/LOD 수식의 서버 렌더링 쿼리 시간 측정치',
            sampleHeaders: ['Formula_Version', 'Query_Duration_ms', 'Engine_Formula_Evaluation'],
            sampleRows: [
              ['Unoptimized Filter()', 2450, 'Row-by-row iteration in memory'],
              ['Optimized Calculate()', 85, 'Direct VertiPaq storage engine query']
            ]
          }
        ]
      },
      {
        id: '13-5',
        code: '13-5',
        title: '인터랙티브 대시보드와 스토리텔링',
        keyword: '상호작용 (Interactivity)',
        scenario: '제조 생산 본부 임원용 대시보드가 단방향 정적 이미지처럼 제작되어 있어, 특정 공장의 수율 급락 원인을 클릭하여 하위 라인과 작업자로 파고드는 드릴다운(Drill-Down) 분석이 불가능합니다. 필터 액션(Filter Action), 하이라이트(Highlight), URL 파라미터 링크, 매개변수(Parameter)를 활용한 동적 지표 전환 기능을 결합하여, 최고경영자(거시적 총괄)부터 현장 반장(미시적 이상 조치)까지 단일 대시보드에서 각자의 관점으로 인터랙티브하게 탐색할 수 있는 비즈니스 스토리텔링 대시보드를 구축하시오.',
        files: [
          {
            name: 'Executive_Operations_Dashboard_Data.csv',
            size: '3.5 MB',
            type: 'csv',
            description: '전사 종합 수율, 공장별 가동률, 스크랩 비용 및 결함 이력',
            sampleHeaders: ['Plant_Code', 'Line_ID', 'Shift', 'Yield_Pct', 'Downtime_Cost_KRW'],
            sampleRows: [
              ['PLANT_A', 'LINE_01', 'Day', 98.4, 1200000],
              ['PLANT_B', 'LINE_03', 'Night', 84.1, 18500000]
            ]
          },
          {
            name: 'Interactivity_Design_Blueprint.xlsx',
            size: '720 KB',
            type: 'xlsx',
            description: '클릭 시 하위 드릴다운 시트 및 매개변수 바인딩 설계서',
            sampleHeaders: ['Trigger_Visual', 'Action_Type', 'Target_Visual', 'Filter_Passing_Field'],
            sampleRows: [
              ['Plant Yield Map', 'Filter Click Action', 'Line Detail Bar Chart', 'Plant_Code'],
              ['Metric Selector Param', 'Parameter Switch', 'KPI Card Measure', 'Selected_Metric']
            ]
          },
          {
            name: 'User_Engagement_Heatmap.csv',
            size: '510 KB',
            type: 'csv',
            description: '경영진 및 현장 사용자의 대시보드 클릭 영역 히트맵 로그',
            sampleHeaders: ['User_Role', 'Interacted_Widget', 'Click_Frequency', 'Satisfaction_Score'],
            sampleRows: [
              ['Executive', 'Top KPI Summary', 1420, 4.8],
              ['Line Supervisor', 'Drill-Down Defect List', 3200, 4.9]
            ]
          }
        ]
      }
    ]
  }
];

function getRandomScenario(): { module: ModuleCategory; scenario: ScenarioItem } {
  const all: { module: ModuleCategory; scenario: ScenarioItem }[] = [];
  for (const mod of MODULES_DATA) {
    for (const item of mod.items) {
      all.push({ module: mod, scenario: item });
    }
  }
  return all[Math.floor(Math.random() * all.length)];
}

// ==========================================
// 2. MAIN APP COMPONENT
// ==========================================

export default function App() {
  // Random Scenario assigned on entry
  const [activeData] = useState<{ module: ModuleCategory; scenario: ScenarioItem }>(() => getRandomScenario());
  const activeModule = activeData.module;
  const activeScenario = activeData.scenario;

  // Pre-exam Notice Modal State ('응시 전 안내사항')
  const [showStartModal, setShowStartModal] = useState<boolean>(true);
  const [isExamStarted, setIsExamStarted] = useState<boolean>(false);

  // Time Limit: 60 minutes countdown (3600 seconds) - starts after clicking '응시시작'
  const TOTAL_TIME_SECONDS = 60 * 60;
  const [secondsRemaining, setSecondsRemaining] = useState<number>(TOTAL_TIME_SECONDS);
  const [isTimeUp, setIsTimeUp] = useState<boolean>(false);

  // Remaining days & attempts
  const REMAINING_DAYS = 18; // D-18 (30일 이내)
  const CURRENT_ATTEMPT = 2; // 2차수
  const TOTAL_ATTEMPTS = 5;  // 총 5회
  const REMAINING_ATTEMPTS = TOTAL_ATTEMPTS - CURRENT_ATTEMPT + 1; // 4회 남음

  // Single Integrated Answer Field
  const [answerContent, setAnswerContent] = useState<string>('');
  const [attachedUserFiles, setAttachedUserFiles] = useState<{ id: string; name: string; size: string }[]>([
    { id: 'f-1', name: '분석_보조자료_초안.xlsx', size: '1.2 MB' }
  ]);
  const [isSavedAlert, setIsSavedAlert] = useState<boolean>(false);

  // File Preview Modal for Data Files
  const [previewFile, setPreviewFile] = useState<AttachedFile | null>(null);

  // AI Chat State
  interface ChatMessage {
    id: string;
    sender: 'ai' | 'user';
    text: string;
    timestamp: string;
  }

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: '안녕하세요! AXAGE 평가 지원 생성형 AI입니다. 무엇을 도와드릴까요?\n\n배정된 시나리오와 데이터셋을 분석하여 문제 정의, 분석 가설 수립, 통계 공식 및 해석, 파이썬/미니탭 코드 등을 적극적으로 지원해 드립니다.',
      timestamp: '방금 전'
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isAiTyping, setIsAiTyping] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Submission Popup Modal
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);

  // 60-Minute Countdown Timer (Active only after exam starts)
  useEffect(() => {
    if (!isExamStarted) return;

    if (secondsRemaining <= 0) {
      setIsTimeUp(true);
      setShowSubmitModal(true);
      return;
    }
    const timer = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsTimeUp(true);
          setShowSubmitModal(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsRemaining, isExamStarted]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAiTyping]);

  // Format timer MM:SS
  const formatTime = (totalSeconds: number) => {
    const mm = Math.floor(totalSeconds / 60);
    const ss = totalSeconds % 60;
    return `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
  };

  // Mock auto-save indicator
  const triggerAutoSave = () => {
    setIsSavedAlert(true);
    setTimeout(() => setIsSavedAlert(false), 2000);
  };

  // Handle User File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const newFile = {
        id: `user-f-${Date.now()}`,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`
      };
      setAttachedUserFiles(prev => [...prev, newFile]);
      triggerAutoSave();
    }
  };

  const removeUserFile = (id: string) => {
    setAttachedUserFiles(prev => prev.filter(f => f.id !== id));
    triggerAutoSave();
  };

  // Handle AI Prompt Submission with intelligent contextual response
  const handleSendPrompt = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputPrompt;
    if (!textToSend.trim() || isAiTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    if (!customPrompt) setInputPrompt('');
    setIsAiTyping(true);

    setTimeout(() => {
      let aiResponseText = '';
      const promptLower = textToSend.toLowerCase();

      if (promptLower.includes('문제') || promptLower.includes('정의') || promptLower.includes('시나리오')) {
        aiResponseText = `[${activeScenario.title} 핵심 문제 정의 가이드]\n` +
          `현재 시나리오의 핵심 문제는 다음과 같은 관점에서 접근하는 것이 효과적입니다.\n` +
          `1. 현상 파악: 단편적인 결과치에만 의존하여 발생하는 프로세스 왜곡 및 잠재 결함 리스크가 존재합니다.\n` +
          `2. 핵심 원인: 통계적 원리를 엄밀히 적용하지 않고 관행적 통계치로 판단한 점입니다.\n` +
          `3. 목표 지표: 제공된 3개의 데이터셋(${activeScenario.files.map(f => f.name).join(', ')})을 교차 검증하여 정량적 개선 목표를 수립하세요.`;
      } else if (promptLower.includes('데이터') || promptLower.includes('분석') || promptLower.includes('파일')) {
        aiResponseText = `[${activeScenario.title} 데이터 분석 제안]\n` +
          `첨부된 3개 데이터셋의 추천 분석 기법:\n` +
          `• 1번 파일(${activeScenario.files[0]?.name}): 주요 변수들의 결측치, 이상치(IQR) 및 기초 통계량을 점검하세요.\n` +
          `• 2번 파일(${activeScenario.files[1]?.name}): 검정 기준 및 규격 스펙과의 갭을 계산하여 유의수준(p-value)을 도출하세요.\n` +
          `• 3번 파일(${activeScenario.files[2]?.name}): 시계열/배치별 변동 패턴을 가시화하여 이상 원인의 귀책점을 규명하세요.`;
      } else if (promptLower.includes('해결') || promptLower.includes('대안') || promptLower.includes('개선')) {
        aiResponseText = `[${activeScenario.title} 권장 해결책 및 개선안]\n` +
          `1. 단기 조치 (Immediate Action):\n` +
          `   - 공정/데이터 필터링 임계치 및 관리 기준 즉각 재조정.\n` +
          `2. 중장기 대책 (Systemic Improvement):\n` +
          `   - 표준 관리계획서(Control Plan) 및 SOP 개정, 모니터링 대시보드 자동화.\n` +
          `3. 기대 효과:\n` +
          `   - 오경보율 60% 이상 저감 및 정량적 수율 향상 기대.`;
      } else {
        aiResponseText = `[AI 분석 피드백]\n` +
          `질의하신 내용("${textToSend}")에 대해 현 모듈 [${activeModule.name} > ${activeScenario.title}] 기준으로 안내드립니다.\n\n` +
          `• 권장 접근법: 주어진 시나리오 데이터에서 우연원인과 이상원인을 식별하고, 가설검정 및 정량 지표로 입증하세요.\n` +
          `• 답안 작성 팁: AI와의 이 대화 로그와 프롬프트는 평가관에게 함께 제출되므로, 도출된 통계 수치를 중간 열 답안지에 반영하시면 높은 가산점을 받으실 수 있습니다.`;
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages(prev => [...prev, aiMsg]);
      setIsAiTyping(false);
    }, 700);
  };

  // Quick insertion of AI advice into answer
  const insertAiTextToAnswer = (text: string) => {
    setAnswerContent(prev => {
      const addition = `\n\n[생성형 AI 분석 결과 인용]\n${text}`;
      return prev ? prev + addition : text;
    });
    triggerAutoSave();
  };

  // Start Exam Handler
  const handleStartExam = () => {
    setShowStartModal(false);
    setIsExamStarted(true);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans select-text">
      {/* ========================================================= */}
      {/* HEADER SECTION */}
      {/* ========================================================= */}
      <header className="bg-slate-950/90 border-b border-slate-800 px-6 py-3.5 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-[1920px] mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Title */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Award className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              AXAGE 역량평가
              <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 font-medium">
                검증 시험
              </span>
            </h1>

            {/* Re-open Instruction Modal Button */}
            <button
              onClick={() => setShowStartModal(true)}
              className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1.5 cursor-pointer transition-colors ml-2"
            >
              <Info className="w-3.5 h-3.5 text-blue-400" />
              <span>응시 전 안내사항 다시보기</span>
            </button>
          </div>

          {/* Test Timer & Submit Action */}
          <div className="flex items-center gap-3">
            {/* 60-Minute Countdown Clock */}
            <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg border font-mono text-base font-bold shadow-sm transition-colors ${
              secondsRemaining < 600
                ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 animate-pulse'
                : 'bg-slate-800/90 border-slate-700 text-slate-200'
            }`}>
              <Clock className={`w-4 h-4 ${secondsRemaining < 600 ? 'text-rose-400' : 'text-blue-400'}`} />
              <span className="text-xs font-sans text-slate-400 mr-0.5">남은 시간:</span>
              <span>{formatTime(secondsRemaining)}</span>
            </div>

            {/* Auto save indicator */}
            {isSavedAlert && (
              <span className="text-xs text-emerald-400 flex items-center gap-1 animate-fade-in">
                <CheckCircle2 className="w-3.5 h-3.5" /> 자동저장됨
              </span>
            )}

            {/* Submit Button */}
            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-md shadow-blue-600/30 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>응시완료 및 제출하기</span>
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 3-COLUMN MAIN LAYOUT */}
      {/* ========================================================= */}
      <main className="flex-1 max-w-[1920px] w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* --------------------------------------------------------- */}
        {/* COLUMN 1: LEFT COLUMN (랜덤 배정 시나리오 & 500자 문제 & 3개 데이터) */}
        {/* --------------------------------------------------------- */}
        <section className="lg:col-span-4 flex flex-col gap-3 h-[calc(100vh-100px)] min-h-[700px]">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 shadow-md flex-1 overflow-y-auto flex flex-col">
            {/* Assigned Scenario Title Card */}
            <div className="pb-3 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wide">
                  {activeModule.name} ({activeModule.englishName})
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-300 font-medium">
                  배정된 평가 시나리오
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">
                {activeScenario.code}. {activeScenario.title}
              </h3>
            </div>

            {/* 500-Character Problem Scenario Body */}
            <div className="mt-3.5 flex-1">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  실전 문제 상황 시나리오 (상세 기술)
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  약 {activeScenario.scenario.length}자
                </span>
              </div>
              <div className="bg-slate-900/90 rounded-lg p-3.5 border border-slate-800/80 text-xs text-slate-200 leading-relaxed text-justify whitespace-pre-line shadow-inner">
                {activeScenario.scenario}
              </div>
            </div>

            {/* Attached 3 Data Files for Selected Scenario */}
            <div className="mt-4 pt-3 border-t border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                  <Database className="w-3.5 h-3.5" />
                  <span>제공 데이터셋 (총 3건 첨부)</span>
                </div>
                <span className="text-[11px] text-slate-400">미리보기 및 가상 다운로드</span>
              </div>

              <div className="space-y-2">
                {activeScenario.files.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                        file.type === 'csv'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-green-600/20 text-green-300 border border-green-600/30'
                      }`}>
                        {file.type}
                      </span>
                      <div className="truncate">
                        <p className="text-xs font-semibold text-slate-200 truncate">{file.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{file.description} ({file.size})</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => setPreviewFile(file)}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                        title="데이터 미리보기"
                      >
                        <Eye className="w-3 h-3 text-blue-400" />
                        <span>보기</span>
                      </button>
                      <button
                        onClick={() => {
                          const csvContent = "data:text/csv;charset=utf-8," +
                            file.sampleHeaders.join(",") + "\n" +
                            file.sampleRows.map(r => r.join(",")).join("\n");
                          const encodedUri = encodeURI(csvContent);
                          const link = document.createElement("a");
                          link.setAttribute("href", encodedUri);
                          link.setAttribute("download", file.name);
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer transition-colors"
                        title="파일 다운로드"
                      >
                        <Download className="w-3.5 h-3.5 text-emerald-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------- */}
        {/* COLUMN 2: CENTER COLUMN (단일 통합 답안작성 & 첨부자료 제출) */}
        {/* --------------------------------------------------------- */}
        <section className="lg:col-span-5 flex flex-col gap-3 h-[calc(100vh-100px)] min-h-[700px]">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 shadow-md flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                <h2 className="text-base font-bold text-white">답안작성</h2>
                <span className="text-xs text-slate-400">
                  [{activeModule.name} - {activeScenario.code} {activeScenario.title}]
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> 실시간 자동저장 중
                </span>
              </div>
            </div>

            {/* Single Unified Answer Form */}
            <div className="flex-1 overflow-y-auto pr-1 py-3 flex flex-col gap-3">
              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-200">
                    답안작성 (문제 정의, AI 분석 결과, 해결책 및 개선 방안 기술) *
                  </label>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {answerContent.length}자 작성됨
                  </span>
                </div>
                <textarea
                  value={answerContent}
                  onChange={e => {
                    setAnswerContent(e.target.value);
                    triggerAutoSave();
                  }}
                  placeholder={`아래 가이드라인에 따라 자유롭게 답안을 작성하세요:

1. [문제 정의] 제시된 시나리오와 데이터셋을 바탕으로 현상(As-Is)과 핵심 문제를 정량적으로 정의하세요.
2. [데이터 분석 및 AI 활용] 우측 생성형 AI를 활용하여 데이터를 분석한 내용과 도출된 인사이트를 정리하세요.
3. [해결책 및 개선 방안] 문제 상황에 대한 최적 해결책, 단기 조치 및 재발 방지 대책을 구체적으로 제시하세요.
4. [기대효과 및 관리 계획] 정량적 개선 효과 및 향후 관리 계획을 기술하세요.`}
                  className="w-full flex-1 min-h-[360px] bg-slate-900 border border-slate-800 rounded-lg p-3.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 leading-relaxed resize-none"
                />
              </div>

              {/* Attachment Section (첨부자료 제출) */}
              <div className="pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                    <Paperclip className="w-3.5 h-3.5 text-indigo-400" />
                    <span>첨부자료 제출 (보고서, 엑셀, 분석 차트 등)</span>
                  </div>
                  <label className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium cursor-pointer transition-colors flex items-center gap-1">
                    <span>파일 첨부하기</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>

                {attachedUserFiles.length > 0 ? (
                  <div className="space-y-1.5 max-h-24 overflow-y-auto">
                    {attachedUserFiles.map(file => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 text-blue-400" />
                          <span className="text-slate-200 font-medium">{file.name}</span>
                          <span className="text-slate-500 text-[11px]">({file.size})</span>
                        </div>
                        <button
                          onClick={() => removeUserFile(file.id)}
                          className="text-slate-400 hover:text-rose-400 cursor-pointer p-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic py-1">
                    첨부된 추가 제출 자료가 없습니다. (필요 시 우측 '파일 첨부하기' 버튼 이용)
                  </p>
                )}
              </div>
            </div>

            {/* Bottom Submit Action */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between shrink-0">
              <span className="text-xs text-slate-400">
                작성 완료 후 우측 버튼을 눌러 제출을 완료하세요.
              </span>
              <button
                onClick={() => setShowSubmitModal(true)}
                className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>응시완료 및 제출하기</span>
              </button>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------- */}
        {/* COLUMN 3: RIGHT COLUMN (생성형 AI 공간) */}
        {/* --------------------------------------------------------- */}
        <section className="lg:col-span-3 flex flex-col gap-3 h-[calc(100vh-100px)] min-h-[700px]">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 shadow-md flex-1 flex flex-col overflow-hidden">
            {/* AI Assistant Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    생성형 AI
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    질의 및 프롬프트가 모두 시험 기록에 자동 저장됩니다
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setChatMessages([
                    {
                      id: `welcome-${Date.now()}`,
                      sender: 'ai',
                      text: '안녕하세요! AXAGE 평가 지원 생성형 AI입니다. 무엇을 도와드릴까요?',
                      timestamp: '방금 전'
                    }
                  ]);
                }}
                className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-900 cursor-pointer"
                title="대화 초기화"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Suggestion Chips */}
            <div className="py-2 flex flex-wrap gap-1.5 border-b border-slate-800/60 shrink-0">
              <button
                onClick={() => handleSendPrompt(`현재 시나리오의 핵심 변수와 문제 정의 방향을 요약해줘.`)}
                className="text-[10px] px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 cursor-pointer transition-colors"
              >
                💡 문제 정의 방향 추천
              </button>
              <button
                onClick={() => handleSendPrompt(`[${activeScenario.files[0]?.name}] 데이터셋의 이상치 탐지 및 분석 절차 알려줘.`)}
                className="text-[10px] px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 cursor-pointer transition-colors"
              >
                📊 데이터셋 분석 가이드
              </button>
              <button
                onClick={() => handleSendPrompt(`이 문제 상황을 해결하기 위한 3단계 개선 대안과 기대효과를 작성해줘.`)}
                className="text-[10px] px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 cursor-pointer transition-colors"
              >
                🛠 해결책 3가지 제안
              </button>
            </div>

            {/* Chat Messages Stream */}
            <div className="flex-1 overflow-y-auto pr-1 py-2 space-y-3">
              {chatMessages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[92%] rounded-xl p-3 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none shadow-sm'
                        : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow-inner'
                    }`}
                  >
                    {msg.sender === 'ai' && (
                      <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-slate-800 text-[10px] text-indigo-400 font-semibold">
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> AI 응답
                        </span>
                        <button
                          onClick={() => insertAiTextToAnswer(msg.text)}
                          className="text-slate-400 hover:text-indigo-300 underline font-normal cursor-pointer text-[10px]"
                        >
                          + 답안에 반영
                        </button>
                      </div>
                    )}
                    <p className="whitespace-pre-line">{msg.text}</p>
                    <span className="block text-[9px] text-right mt-1 opacity-60">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {isAiTyping && (
                <div className="flex items-center gap-1.5 text-xs text-indigo-400 p-2 bg-slate-900/60 rounded-lg w-fit border border-slate-800">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>생성형 AI가 분석 중입니다...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Prompt Input Form */}
            <div className="pt-2 border-t border-slate-800 shrink-0">
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleSendPrompt();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputPrompt}
                  onChange={e => setInputPrompt(e.target.value)}
                  placeholder="프롬프트를 입력하세요... (평가에 반영됨)"
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!inputPrompt.trim() || isAiTyping}
                  className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white cursor-pointer transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* ========================================================= */}
      {/* 1. INITIAL POPUP MODAL: '응시 전 안내사항' */}
      {/* ========================================================= */}
      {showStartModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative text-left flex flex-col max-h-[90vh] overflow-y-auto animate-scale-up">
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">응시 전 안내사항</h3>
                  <p className="text-xs text-slate-400">AXAGE 역량평가 모듈별 검증시험 필수 수험생 가이드</p>
                </div>
              </div>
            </div>

            {/* Status Fields (응시가능기한 & 현재응시/남은기회) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
              {/* D-Day badge */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] text-amber-400/80 font-medium">응시가능 기한</p>
                  <p className="text-sm font-bold text-amber-300">
                    D-{REMAINING_DAYS} <span className="text-xs font-normal text-amber-400/90">(2026.11.02 23:59까지)</span>
                  </p>
                </div>
              </div>

              {/* Attempt Count Badge */}
              <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] text-indigo-300/80 font-medium">현재 응시 및 남은 기회</p>
                  <p className="text-sm font-bold text-white">
                    현재 응시 <span className="text-indigo-400 font-extrabold">{CURRENT_ATTEMPT}차수</span> / 남은 기회 <span className="text-emerald-400 font-extrabold">{REMAINING_ATTEMPTS}회</span>
                    <span className="text-xs font-normal text-slate-400 ml-1">(총 {TOTAL_ATTEMPTS}회 중)</span>
                  </p>
                </div>
              </div>
            </div>

            {/* 6 Essential Instructions */}
            <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 space-y-2.5 text-xs text-slate-200 leading-relaxed mb-5 shadow-inner">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
                <span>아래에 제시된 시나리오 상황과 주어진 데이터를 바탕으로 문제를 정의하세요.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
                <span>생성형 AI 를 이용하여 데이터를 분석하고, 문제 상황에 대한 해결책을 제시하세요.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
                <span>생성형 AI 에 입력 된 프롬프트와 제공된 답변 및 최종 작성하신 답안 모두 평가의 대상이 됩니다.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center shrink-0 text-[11px]">4</span>
                <span>제출하고자 하는 첨부자료가 있다면 첨부하기 기능을 활용하세요.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 font-bold flex items-center justify-center shrink-0 text-[11px]">5</span>
                <span>시험시간은 60분이며, 시간 경과 시 답안은 자동저장되어 제출 됩니다.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[11px]">6</span>
                <span>답안 작성이 완료되면 '응시완료 및 제출하기' 버튼을 눌러주세요. 입력된 프롬프트와 답변 및 첨부자료가 모두 최종 저장되어 제출됩니다.</span>
              </div>
            </div>

            {/* Bottom Confirmation & Action Button */}
            <div className="pt-3 border-t border-slate-800 text-center flex flex-col items-center gap-3">
              <p className="text-sm font-semibold text-slate-200">
                응시시작 버튼을 누르면 시험이 시작됩니다. 응시하시겠습니까?
              </p>
              <button
                onClick={handleStartExam}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <span>응시시작</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. DATA FILE PREVIEW MODAL */}
      {/* ========================================================= */}
      {previewFile && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-400" />
                <div>
                  <h4 className="text-base font-bold text-white">{previewFile.name}</h4>
                  <p className="text-xs text-slate-400">{previewFile.description} ({previewFile.size})</p>
                </div>
              </div>
              <button
                onClick={() => setPreviewFile(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-4 flex-1 overflow-x-auto overflow-y-auto">
              <p className="text-xs text-slate-400 mb-2">샘플 미리보기 (상위 5행 레코드):</p>
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900 border-b border-slate-800 text-slate-300">
                    {previewFile.sampleHeaders.map((h, i) => (
                      <th key={i} className="p-2 font-semibold font-mono">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {previewFile.sampleRows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-900/50">
                      {row.map((val, cIdx) => (
                        <td key={cIdx} className="p-2 text-slate-300">{val ?? 'NULL'}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setPreviewFile(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. SUBMISSION POPUP MODAL */}
      {/* ========================================================= */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-center flex flex-col items-center animate-scale-up">
            {/* Close Button if not forced time up */}
            {!isTimeUp && (
              <button
                onClick={() => setShowSubmitModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {/* Success Icon */}
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-4 shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            {/* Core Notification Content */}
            <h3 className="text-xl font-bold text-white mb-1.5">
              수고하셨습니다. 제출이 완료되었습니다.
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              입력하신 답안과 생성형 AI 프롬프트 질의 내역, 첨부파일이 평가 시스템에 안전하게 기록되었습니다.
            </p>

            {/* Submission Detail Card */}
            <div className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-4 text-left text-xs space-y-2.5 mb-6">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400">응시 모듈 / 시나리오:</span>
                <span className="font-semibold text-slate-200">
                  {activeModule.name} - {activeScenario.code}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">남은 응시가능 기한:</span>
                <span className="font-bold text-amber-400">
                  2026.11.02까지 (D-{REMAINING_DAYS})
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">남은 응시기회:</span>
                <span className="font-bold text-emerald-400">
                  {REMAINING_ATTEMPTS}회 (총 {TOTAL_ATTEMPTS}회 중)
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <span className="text-slate-400">평가 기록 AI 프롬프트 수:</span>
                <span className="font-mono text-indigo-400">
                  {chatMessages.filter(m => m.sender === 'user').length}건
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">첨부자료:</span>
                <span className="font-mono text-slate-300">
                  {attachedUserFiles.length}개 파일
                </span>
              </div>
            </div>

            {/* Bottom Button linking to requested URL */}
            <div className="w-full space-y-2">
              <a
                href="https://test17-flax.vercel.app/"
                target="_self"
                rel="noopener noreferrer"
                className="w-full block py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 text-center transition-all active:scale-95 cursor-pointer"
              >
                제출하기
              </a>
              <p className="text-[11px] text-slate-500 text-center">
                클릭 시 최종 검증 포털 (https://test17-flax.vercel.app/) 로 이동합니다.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import type { Project } from "./work";

// Migrated from Aspen’s original Hyundai case study, preserving its media.
// The source prose says 9 drivers, while its research overview board says 10
// users; omit an unqualified participant count rather than reconcile it by guess.
// The reported +10% is a prototype-study confidence score, not a safety claim.
// The source pipeline labels camera/FER and Tobii integration as future work.
export const hyundaiProject: Project = {
  "slug": "hyundai",
  "title": "Hyundai IONIQ 6 — designing for trust at L2+",
  "client": "Hyundai · HATCI Lab",
  "role": "HMI Designer",
  "period": "Jan — May 2025",
  "year": "2025",
  "date": "9/17/25",
  "category": "Automotive · HMI",
  "summary": "A sponsored HMI project exploring driver confidence in Hyundai’s HDA 2.0 system. Real-driving research, simulator testing and three interface directions shaped an adaptive instrument cluster for the IONIQ 6.",
  "tags": [
    "HMI design",
    "Driving research",
    "Interactive prototyping"
  ],
  "cover": "/work/hyundai.png",
  "coverWidth": 2060,
  "coverHeight": 967,
  "coverFit": "contain",
  "coverBg": "#ffffff",
  "theme": "light",
  "status": "live",
  "metrics": [
    {
      "label": "Confidence score vs. original UI · prototype study",
      "value": "+10%"
    },
    {
      "label": "Interface directions tested",
      "value": "3"
    },
    {
      "label": "Test environments · real car & simulator",
      "value": "2"
    }
  ],
  "sections": [
    {
      "chapter": "Research",
      "heading": "Clarity at the handoff",
      "body": "How might we help drivers feel more confident when control shifts between the human and Hyundai’s HDA 2.0 system? This sponsored HMI project explored the IONIQ 6 experience in Level 2 and Level 2+ assistance scenarios, focusing on system status, information hierarchy and feedback at critical transitions.",
      "figures": [
        {
          "src": "/work/hyundai/01-bwE5bnnAlBpKw9wHI66xQE6CBag.png",
          "width": 1904,
          "height": 720,
          "alt": "The original IONIQ 6 instrument cluster and HDA status indicators.",
          "caption": "The original IONIQ 6 instrument cluster and HDA status indicators."
        }
      ]
    },
    {
      "chapter": "Research",
      "heading": "Understand the people around the system",
      "body": "The stakeholder map placed Hyundai and the HMI lab alongside drivers, other road users, regulators and groups with different accessibility needs. It helped frame the interface as part of a wider driving experience, with expectations that extend beyond the person looking at the cluster.",
      "figures": [
        {
          "src": "/work/hyundai/02-TKZj6qwi7o0lSGXuFv1nvcGKCw.png",
          "width": 1786,
          "height": 823,
          "alt": "Stakeholder map organized by influence and importance.",
          "caption": "Stakeholder map organized by influence and importance."
        }
      ]
    },
    {
      "chapter": "Research",
      "heading": "Observe driving in two environments",
      "body": "Drivers completed tasks in both a real vehicle and a custom Unreal Engine simulator. The setup combined ECG-based heart-rate variability, Tobii eye tracking and self-report surveys. A steering rig, highway rendering and surround sound allowed the team to explore assistance behavior in a repeatable setting before comparing it with the real-driving experience.",
      "figures": [
        {
          "src": "/work/hyundai/03-747fVSg38mokrReOL40M47r00s.png",
          "width": 1920,
          "height": 954,
          "alt": "Research overview: driving tasks, data collection and two test environments.",
          "caption": "Research overview: driving tasks, data collection and two test environments."
        },
        {
          "src": "/work/hyundai/04-8FkhskjBGQnEpOUP2OMu9twWG8.png",
          "width": 1638,
          "height": 670,
          "alt": "The simulator rig, steering controls and surrounding equipment.",
          "caption": "The simulator rig, steering controls and surrounding equipment."
        },
        {
          "src": "/work/hyundai/05-0xdgD29FFB4fkF1yq9QCiy3TUSo.png",
          "width": 1997,
          "height": 967,
          "alt": "Real-driving and simulator sessions with recording and observation equipment.",
          "caption": "Real-driving and simulator sessions with recording and observation equipment."
        }
      ]
    },
    {
      "chapter": "Research",
      "heading": "Combine workload, behavior and feedback",
      "body": "The Driving Activity Load Index captured attention, visual and auditory demand, time pressure, interference and situational stress. We considered those responses alongside task observations and biometric data, then organized the feedback into an affinity map. Exploratory comparisons between simulator and car measures informed the next study round.",
      "figures": [
        {
          "src": "/work/hyundai/06-X9bZhh8eg4j0KiTvr7MH2DuxgU.png",
          "width": 1920,
          "height": 714,
          "alt": "Driving Activity Load Index questionnaire used for participant feedback.",
          "caption": "Driving Activity Load Index questionnaire used for participant feedback."
        },
        {
          "src": "/work/hyundai/07-NexWrvQlPPPTrme336xKZT2fo.png",
          "width": 1920,
          "height": 719,
          "alt": "Participant workload ratings: average importance weights and raw scores.",
          "caption": "Participant workload ratings: average importance weights and raw scores."
        },
        {
          "src": "/work/hyundai/08-senCV849nytWtiUXNUBiPyXWIFA.png",
          "width": 1920,
          "height": 961,
          "alt": "Exploratory simulator–car correlation analysis for the lane-keeping task.",
          "caption": "Exploratory simulator–car correlation analysis for the lane-keeping task."
        },
        {
          "src": "/work/hyundai/09-NOMoz2kU6qBLRqvcidBrnQLI8.png",
          "width": 3016,
          "height": 1397,
          "alt": "Research observations organized into an affinity map.",
          "caption": "Research observations organized into an affinity map."
        },
        {
          "src": "/work/hyundai/10-EEl3tzRGN5DANlelhbkpEokM.png",
          "width": 1920,
          "height": 950,
          "alt": "The participant feedback protocol and its driving-workload dimensions.",
          "caption": "The participant feedback protocol and its driving-workload dimensions."
        }
      ]
    },
    {
      "chapter": "Research",
      "heading": "Three gaps in the existing interface",
      "body": "Round 1 surfaced three connected problems: ambiguous activation and status cues, a cluttered visual hierarchy, and too little timely reassurance about what the assistance system was doing. Together, these made handoff moments harder to interpret. The design opportunity was to communicate the right state and the right information at the moment it mattered.",
      "figures": [
        {
          "src": "/work/hyundai/11-6ONvM1IRDt2q88AzI5A7FS4Qqg.png",
          "width": 1920,
          "height": 633,
          "alt": "Pain point 1: ambiguous system communication makes assistance states hard to read.",
          "caption": "Pain point 1: ambiguous system communication makes assistance states hard to read."
        },
        {
          "src": "/work/hyundai/12-dRS9i0ilfqenQhJVLsHMQbTwY.png",
          "width": 1920,
          "height": 646,
          "alt": "Pain point 2: an unclear information hierarchy increases cognitive effort.",
          "caption": "Pain point 2: an unclear information hierarchy increases cognitive effort."
        },
        {
          "src": "/work/hyundai/13-yi5tIZX6ktjdCQxCRhli3fVss.png",
          "width": 1920,
          "height": 539,
          "alt": "Pain point 3: limited timely feedback leaves drivers uncertain about assistance.",
          "caption": "Pain point 3: limited timely feedback leaves drivers uncertain about assistance."
        }
      ]
    },
    {
      "chapter": "Design",
      "heading": "Turn research into interface requirements",
      "body": "The first requirements were concrete: make entry into and exit from HDA visible, distinguish active and interrupted assistance, and keep important feedback readable without obscuring the driving view. These requirements connected each pain point to a behavior the interface could communicate.",
      "figures": [
        {
          "src": "/work/hyundai/14-C20yLBCr3JF3wok870qhrckDJNI.png",
          "width": 1920,
          "height": 853,
          "alt": "Early requirement: make transitions into and out of HDA visually clear.",
          "caption": "Early requirement: make transitions into and out of HDA visually clear."
        },
        {
          "src": "/work/hyundai/15-ZeSXMnW6LTHJiaUUfq8oyNpTj1s.png",
          "width": 1920,
          "height": 860,
          "alt": "Early requirement: distinguish active, inactive and interrupted assistance.",
          "caption": "Early requirement: distinguish active, inactive and interrupted assistance."
        },
        {
          "src": "/work/hyundai/16-W7U6uMWIbEF2LAgu8PJzSpk0o.png",
          "width": 1920,
          "height": 887,
          "alt": "Early requirement: support engagement without blocking the driving visualization.",
          "caption": "Early requirement: support engagement without blocking the driving visualization."
        }
      ]
    },
    {
      "chapter": "Design",
      "heading": "Explore the hierarchy before the visual finish",
      "body": "Low-fidelity prototypes separated driving status from secondary information and explored layouts for manual driving, active assistance, lane detection and heavy traffic. Comparing these states side by side made it easier to decide what should stay stable and what should change with the driving mode.",
      "figures": [
        {
          "src": "/work/hyundai/17-Gw3LafFg3OQvBcnlE2vnJ5BB4.png",
          "width": 1920,
          "height": 898,
          "alt": "Low-fidelity layouts for assisted driving, manual driving and the welcome state.",
          "caption": "Low-fidelity layouts for assisted driving, manual driving and the welcome state."
        },
        {
          "src": "/work/hyundai/18-UMt3dEIanp6ydOqBeXZHVQgWak.png",
          "width": 1920,
          "height": 932,
          "alt": "Low-fidelity explorations of lane detection, heavy traffic and secondary information.",
          "caption": "Low-fidelity explorations of lane detection, heavy traffic and secondary information."
        },
        {
          "src": "/work/hyundai/19-zO9dwRDgBiQsFfGRXzj2DZaBlc.png",
          "width": 1920,
          "height": 943,
          "alt": "A comparison of the original cluster, simplified layouts and early concepts.",
          "caption": "A comparison of the original cluster, simplified layouts and early concepts."
        }
      ]
    },
    {
      "chapter": "Design",
      "heading": "Iterate across states, not just one screen",
      "body": "The exploration expanded into a family of instrument-cluster states. Layout, vehicle imagery, status treatments and feedback were refined together, so the proposal could communicate changes in assistance rather than only present a polished static view.",
      "figures": [
        {
          "src": "/work/hyundai/20-P0bKPXtryxRW3RqTz2cENvRH1c.png",
          "width": 2017,
          "height": 2178,
          "alt": "Interface iterations across vehicle states, layouts and status treatments.",
          "caption": "Interface iterations across vehicle states, layouts and status treatments."
        }
      ]
    },
    {
      "chapter": "Design",
      "heading": "Build a consistent visual vocabulary",
      "body": "A shared system brought typography, icons, colors, vehicle illustrations and assistance components into one vocabulary. The component work focused on making the difference between normal operation, active support and a request for driver attention easier to recognize.",
      "figures": [
        {
          "src": "/work/hyundai/21-8aYvczjxqWB6dxJ3uRAN3uOtcD0.png",
          "width": 2284,
          "height": 2286,
          "alt": "Design-system board covering vehicle illustrations and assistance states.",
          "caption": "Design-system board covering vehicle illustrations and assistance states."
        },
        {
          "src": "/work/hyundai/22-otF4o2N7Teb8perjWU6BpaRak.png",
          "width": 2010,
          "height": 1438,
          "alt": "Typography, icons, color and component treatments for the HDA interface.",
          "caption": "Typography, icons, color and component treatments for the HDA interface."
        }
      ]
    },
    {
      "chapter": "Design",
      "heading": "Test three directions",
      "body": "We developed three interface directions for comparison. White UI established a minimal baseline. Green UI emphasized reassurance and clear assistance feedback. Blue UI explored a more technical, information-focused presentation. The study compared these directions through driving tasks and participant feedback.",
      "figures": [
        {
          "src": "/work/hyundai/23-jaxRc28lz0aHp6OWEBZEMKEz8U.png",
          "width": 695,
          "height": 298,
          "alt": "White UI: a minimal baseline for comparison.",
          "caption": "White UI: a minimal baseline for comparison."
        },
        {
          "src": "/work/hyundai/24-qq5Tkwsr8qChWGTdrpc5ZXIBbXc.png",
          "width": 722,
          "height": 305,
          "alt": "Green UI: an interface direction focused on reassurance and readable assistance.",
          "caption": "Green UI: an interface direction focused on reassurance and readable assistance."
        },
        {
          "src": "/work/hyundai/25-LFbMsUXOF7jYObwUFIJEYutXdHo.png",
          "width": 738,
          "height": 299,
          "alt": "Blue UI: the information-focused direction presented in the original study.",
          "caption": "Blue UI: the information-focused direction presented in the original study."
        }
      ]
    },
    {
      "chapter": "Validation",
      "heading": "Round 2: compare, co-design and refine",
      "body": "The second round combined visual UI testing with functional testing in the simulator and car. Whiteboard co-design let participants rearrange information and discuss what they needed in each driving mode. Their feedback pointed toward an adaptive hierarchy: speed mattered more during manual driving, while the vehicle visualization became more important with assistance engaged.",
      "figures": [
        {
          "src": "/work/hyundai/26-110f5s2DIHjMsDIVmEjPPQS9yc.png",
          "width": 1637,
          "height": 695,
          "alt": "Round 2 study plan: visual UI testing and functional simulator/car testing.",
          "caption": "Round 2 study plan: visual UI testing and functional simulator/car testing."
        },
        {
          "src": "/work/hyundai/27-5hRoOXdNJIPAd8PfoEPDjrHaBI.png",
          "width": 1646,
          "height": 448,
          "alt": "Testing process from co-design through insight gathering and the next iteration.",
          "caption": "Testing process from co-design through insight gathering and the next iteration."
        },
        {
          "src": "/work/hyundai/28-vSBKw1QTiEgdwMXpRJ1AGPOHdP8.png",
          "width": 1691,
          "height": 666,
          "alt": "Whiteboard exercise for arranging instrument-cluster information.",
          "caption": "Whiteboard exercise for arranging instrument-cluster information."
        },
        {
          "src": "/work/hyundai/29-BDVHagqGHsMAZk7HC0hJBBLAc.png",
          "width": 1690,
          "height": 572,
          "alt": "Mode-dependent findings about information density, hierarchy and vehicle visualization.",
          "caption": "Mode-dependent findings about information density, hierarchy and vehicle visualization."
        }
      ]
    },
    {
      "chapter": "Validation",
      "heading": "Make confidence measurable",
      "body": "The study used a custom confidence score to bring physiological signals, task timing and self-report data into a common framework. The documentation records how data was prepared, aligned and weighted. The pipeline also separates implemented inputs from planned facial-emotion and eye-tracking extensions, keeping the measurement model open to further development.",
      "figures": [
        {
          "src": "/work/hyundai/30-aBMoQB7KSCKsbuVVjNicAaBKL8.png",
          "width": 1920,
          "height": 967,
          "alt": "Confidence-score calculation with data preparation, time stamps and parameters.",
          "caption": "Confidence-score calculation with data preparation, time stamps and parameters."
        },
        {
          "src": "/work/hyundai/31-LkGHOBtn2MqcVPzCmrmK2eUHaA.png",
          "width": 1747,
          "height": 1126,
          "alt": "Confidence-data pipeline, distinguishing implemented inputs from future extensions.",
          "caption": "Confidence-data pipeline, distinguishing implemented inputs from future extensions."
        }
      ]
    },
    {
      "chapter": "Validation",
      "heading": "Green UI led the prototype comparison",
      "body": "The project study reported that Green UI achieved the highest confidence score, with a **10% improvement over the original UI**. The comparison charts show how the three directions performed for the participants shown. This result guided the final prototype toward clearer assistance states and information that adapts to the driving mode.",
      "figures": [
        {
          "src": "/work/hyundai/32-ScvQ6mqHJGWuNJUYe2uk2Fwig.png",
          "width": 2366,
          "height": 1160,
          "alt": "Confidence-score comparisons for the White, Green and Blue interface directions.",
          "caption": "Confidence-score comparisons for the White, Green and Blue interface directions."
        }
      ],
      "callout": {
        "variant": "insight",
        "label": "Prototype study",
        "title": "+10% confidence score",
        "text": "Green UI compared with the original interface in this project’s prototype study."
      }
    },
    {
      "chapter": "Validation",
      "heading": "Compare simulator and real-driving measures",
      "body": "Paired-sample analysis compared simulator and real-driving measures from the same participants. The analysis considered confidence scores, UX self-reports, pupil size, heart-rate variability and task time, giving the team several perspectives on the experience across environments.",
      "figures": [
        {
          "src": "/work/hyundai/33-23hGPel2buNxH6CsZlIgn3yoA.png",
          "width": 2006,
          "height": 1518,
          "alt": "Paired-sample analysis process comparing simulator and real-driving measures.",
          "caption": "Paired-sample analysis process comparing simulator and real-driving measures."
        }
      ],
      "table": {
        "headers": [
          "Measure",
          "Source",
          "Focus"
        ],
        "rows": [
          [
            "Confidence score",
            "Custom confidence metric",
            "Reported certainty and comfort"
          ],
          [
            "UX self-report",
            "Custom UI questionnaire",
            "Usability, clarity and satisfaction"
          ],
          [
            "Pupil size",
            "Tobii Pro Glasses 2",
            "A signal considered in cognitive-load analysis"
          ],
          [
            "HRV (RMSSD)",
            "Polar Beat ECG",
            "Physiological variation during driving tasks"
          ],
          [
            "Task time",
            "Simulator and real-car interaction logs",
            "Time and friction in completing tasks"
          ]
        ]
      }
    },
    {
      "chapter": "Final concept",
      "heading": "A clear system of assistance feedback",
      "body": "The final Green UI brings together a compact status panel, a central vehicle illustration and a dedicated steering-assistance indicator. Dynamic icons distinguish paused and active states, while lane-keeping and following-distance feedback keep the assistance behavior visible. Information density changes with the driving mode.",
      "figures": [
        {
          "src": "/work/hyundai/34-5IyC25uNYsrDAOeXKpkiHenz0.png",
          "width": 1344,
          "height": 504,
          "alt": "The final Green UI with speed, vehicle visualization and steering-assistance status.",
          "caption": "The final Green UI with speed, vehicle visualization and steering-assistance status."
        },
        {
          "src": "/work/hyundai/35-ookBJb3Uz94g31o1CfOgfNJKuU.png",
          "width": 1681,
          "height": 437,
          "alt": "Status-panel component with compact icons and expanded feedback.",
          "caption": "Status-panel component with compact icons and expanded feedback."
        },
        {
          "src": "/work/hyundai/36-ljMLsTsb8QvvAye1iso5NGUV98.png",
          "width": 1526,
          "height": 438,
          "alt": "Central vehicle illustration communicating the current driving state.",
          "caption": "Central vehicle illustration communicating the current driving state."
        },
        {
          "src": "/work/hyundai/37-6K9aCro6E1YotRDDfEzfd9VgoQ.png",
          "width": 1698,
          "height": 438,
          "alt": "Steering-assistance component indicating machine-assisted steering.",
          "caption": "Steering-assistance component indicating machine-assisted steering."
        }
      ]
    },
    {
      "chapter": "Final concept",
      "heading": "See the prototype in motion",
      "body": "Three prototype sequences show the Green UI in motion, extending the component system into changes of state and feedback over time.",
      "videos": [
        {
          "src": "/work/hyundai/38-cJ5hmjRXuoVOmDgREXP3ITTL40Q.mp4",
          "title": "Lane-keeping assistance demo",
          "poster": "/work/hyundai/38-cJ5hmjRXuoVOmDgREXP3ITTL40Q.jpg",
          "width": 1280,
          "height": 720
        },
        {
          "src": "/work/hyundai/39-l0DDD6WliFV35oQWjXtGMEokdm0.mp4",
          "title": "Following-distance demo",
          "poster": "/work/hyundai/39-l0DDD6WliFV35oQWjXtGMEokdm0.jpg",
          "width": 1280,
          "height": 720
        },
        {
          "src": "/work/hyundai/40-87uEUPs8PzUhntr9n1wPYjuPUQ.mp4",
          "title": "Highway Driving Assist demo",
          "poster": "/work/hyundai/40-87uEUPs8PzUhntr9n1wPYjuPUQ.jpg",
          "width": 1280,
          "height": 720
        }
      ]
    },
    {
      "chapter": "Final concept",
      "heading": "North Star: bring feedback closer to the driver",
      "body": "The North Star concept explored a steering-wheel-mounted display and a fixed central screen within the turning wheel. Sketches and screen studies considered shorter eye travel and more immediate feedback, alongside the challenges of motion, rotating content and cognitive load. This remained a concept for further exploration.",
      "figures": [
        {
          "src": "/work/hyundai/41-AfwBikWkicZ3wWB4i2ytlw6Y.png",
          "width": 1638,
          "height": 539,
          "alt": "North Star questions about the cabin experience and vehicle handoff.",
          "caption": "North Star questions about the cabin experience and vehicle handoff."
        },
        {
          "src": "/work/hyundai/42-I4SNQypWkbBh26V67x9BVf8pww.png",
          "width": 1818,
          "height": 815,
          "alt": "Wheel-mounted display concept and its eye-travel, visibility and motion tradeoffs.",
          "caption": "Wheel-mounted display concept and its eye-travel, visibility and motion tradeoffs."
        },
        {
          "src": "/work/hyundai/43-kSacItoVGazhESQU5bOUPsjcWnU.png",
          "width": 1920,
          "height": 970,
          "alt": "Thumbnail sketches exploring steering-wheel displays and instrument layouts.",
          "caption": "Thumbnail sketches exploring steering-wheel displays and instrument layouts."
        },
        {
          "src": "/work/hyundai/44-oD6r2ChRHgEdXBXuVv15ZaH4.png",
          "width": 1856,
          "height": 787,
          "alt": "Steering-wheel concept with a fixed central screen as the wheel turns.",
          "caption": "Steering-wheel concept with a fixed central screen as the wheel turns."
        },
        {
          "src": "/work/hyundai/45-eNyGe4QiR6djhgWTdowVMqJxNwA.png",
          "width": 1878,
          "height": 935,
          "alt": "Screen explorations for driving information, vehicle status and handoff cues.",
          "caption": "Screen explorations for driving information, vehicle status and handoff cues."
        }
      ]
    },
    {
      "chapter": "Final concept",
      "heading": "The next study environment",
      "body": "The cabin visualizations bring the steering-wheel concept and main display into a wider interior experience. Next steps were to improve simulator–UI integration, create opportunities to learn the assistance system through interaction, and add a more complex cityscape. Further testing with drivers familiar with Hyundai vehicles would help examine the wide variation in feedback observed in this study.",
      "figures": [
        {
          "src": "/work/hyundai/46-FE4DlXRLVGyhVA5RvjRrhlkVXBQ.png",
          "width": 1922,
          "height": 1082,
          "alt": "North Star cabin visualization with a compact display in the steering wheel.",
          "caption": "North Star cabin visualization with a compact display in the steering wheel."
        },
        {
          "src": "/work/hyundai/47-OArtUZF2KYxCy5eE2AOpLXpzJwI.png",
          "width": 1920,
          "height": 1080,
          "alt": "North Star cabin visualization connecting steering-wheel feedback and the main display.",
          "caption": "North Star cabin visualization connecting steering-wheel feedback and the main display."
        }
      ]
    }
  ]
};

export const hyundaiProjectCn: Project = {
  ...hyundaiProject,
  "title": "Hyundai IONIQ 6 — 为 L2+ 驾驶辅助建立信心",
  "role": "人机界面设计师",
  "period": "2025 年 1 月 — 5 月",
  "category": "汽车 · 人机交互",
  "summary": "一个由现代支持的 HMI 项目，探索驾驶者对 HDA 2.0 系统的信心。通过实车研究、模拟器测试与三种界面方向的比较，为 IONIQ 6 设计随驾驶模式调整的信息界面。",
  "tags": [
    "人机界面设计",
    "驾驶体验研究",
    "交互原型"
  ],
  "metrics": [
    {
      "label": "对比原有界面的信心评分 · 原型研究",
      "value": "+10%"
    },
    {
      "label": "参与测试的界面方向",
      "value": "3"
    },
    {
      "label": "测试环境 · 实车与模拟器",
      "value": "2"
    }
  ],
  "sections": [
    {
      "chapter": "研究",
      "heading": "让控制交接更清晰",
      "body": "当控制在驾驶者与现代 HDA 2.0 系统之间切换时，怎样让人更有信心？这个由现代支持的人机界面项目聚焦 IONIQ 6 的 L2 与 L2+ 驾驶辅助场景，研究系统状态、信息层级以及关键交接时刻的反馈。",
      "figures": [
        {
          "src": "/work/hyundai/01-bwE5bnnAlBpKw9wHI66xQE6CBag.png",
          "width": 1904,
          "height": 720,
          "alt": "IONIQ 6 原有仪表界面及 HDA 状态指示。",
          "caption": "IONIQ 6 原有仪表界面及 HDA 状态指示。"
        }
      ]
    },
    {
      "chapter": "研究",
      "heading": "理解系统周围的人",
      "body": "利益相关者地图涵盖现代与 HMI 实验室，也纳入驾驶者、其他道路使用者、监管机构及有不同无障碍需求的人群。它帮助我们把仪表界面放回完整的驾驶体验中，理解那些超出屏幕本身的需求与期待。",
      "figures": [
        {
          "src": "/work/hyundai/02-TKZj6qwi7o0lSGXuFv1nvcGKCw.png",
          "width": 1786,
          "height": 823,
          "alt": "按影响力与重要性梳理的利益相关者地图。",
          "caption": "按影响力与重要性梳理的利益相关者地图。"
        }
      ]
    },
    {
      "chapter": "研究",
      "heading": "在两种环境中观察驾驶",
      "body": "驾驶者分别在实车与基于 Unreal Engine 搭建的模拟器中完成任务。研究结合 ECG 心电与心率变异性、Tobii 眼动追踪及主观问卷。方向盘装置、高速公路场景与环绕声让团队能够在可重复的环境中探索辅助系统的行为，再与实车体验进行比较。",
      "figures": [
        {
          "src": "/work/hyundai/03-747fVSg38mokrReOL40M47r00s.png",
          "width": 1920,
          "height": 954,
          "alt": "研究概览：驾驶任务、数据采集与两种测试环境。",
          "caption": "研究概览：驾驶任务、数据采集与两种测试环境。"
        },
        {
          "src": "/work/hyundai/04-8FkhskjBGQnEpOUP2OMu9twWG8.png",
          "width": 1638,
          "height": 670,
          "alt": "模拟驾驶装置、方向盘控制器及周边设备。",
          "caption": "模拟驾驶装置、方向盘控制器及周边设备。"
        },
        {
          "src": "/work/hyundai/05-0xdgD29FFB4fkF1yq9QCiy3TUSo.png",
          "width": 1997,
          "height": 967,
          "alt": "配合记录与观察设备开展的实车和模拟驾驶测试。",
          "caption": "配合记录与观察设备开展的实车和模拟驾驶测试。"
        }
      ]
    },
    {
      "chapter": "研究",
      "heading": "结合驾驶负荷、行为与主观反馈",
      "body": "驾驶活动负荷指数用于了解注意力投入、视觉与听觉需求、时间压力、干扰及情境压力。我们结合任务观察、生理数据和问卷反馈，通过亲和图梳理共性问题，并对模拟器与实车指标进行探索性比较，为下一轮研究提供依据。",
      "figures": [
        {
          "src": "/work/hyundai/06-X9bZhh8eg4j0KiTvr7MH2DuxgU.png",
          "width": 1920,
          "height": 714,
          "alt": "用于收集参与者反馈的驾驶活动负荷指数问卷。",
          "caption": "用于收集参与者反馈的驾驶活动负荷指数问卷。"
        },
        {
          "src": "/work/hyundai/07-NexWrvQlPPPTrme336xKZT2fo.png",
          "width": 1920,
          "height": 719,
          "alt": "参与者的驾驶负荷评分：平均权重与原始分数。",
          "caption": "参与者的驾驶负荷评分：平均权重与原始分数。"
        },
        {
          "src": "/work/hyundai/08-senCV849nytWtiUXNUBiPyXWIFA.png",
          "width": 1920,
          "height": 961,
          "alt": "围绕车道保持任务开展的模拟器与实车相关性探索分析。",
          "caption": "围绕车道保持任务开展的模拟器与实车相关性探索分析。"
        },
        {
          "src": "/work/hyundai/09-NOMoz2kU6qBLRqvcidBrnQLI8.png",
          "width": 3016,
          "height": 1397,
          "alt": "通过亲和图整理的研究观察与反馈。",
          "caption": "通过亲和图整理的研究观察与反馈。"
        },
        {
          "src": "/work/hyundai/10-EEl3tzRGN5DANlelhbkpEokM.png",
          "width": 1920,
          "height": 950,
          "alt": "参与者反馈流程及其驾驶负荷评估维度。",
          "caption": "参与者反馈流程及其驾驶负荷评估维度。"
        }
      ]
    },
    {
      "chapter": "研究",
      "heading": "原有界面的三个沟通缺口",
      "body": "第一轮测试呈现出三个相互关联的问题：功能启停与状态提示不够明确、视觉层级混乱，以及缺少对辅助系统当前行为的及时反馈。这些问题让控制交接时刻更难理解。设计机会在于：在关键时刻清晰呈现当前状态与必要信息。",
      "figures": [
        {
          "src": "/work/hyundai/11-6ONvM1IRDt2q88AzI5A7FS4Qqg.png",
          "width": 1920,
          "height": 633,
          "alt": "痛点一：系统沟通不清，驾驶辅助状态难以辨认。",
          "caption": "痛点一：系统沟通不清，驾驶辅助状态难以辨认。"
        },
        {
          "src": "/work/hyundai/12-dRS9i0ilfqenQhJVLsHMQbTwY.png",
          "width": 1920,
          "height": 646,
          "alt": "痛点二：信息层级不清，增加理解与判断的负担。",
          "caption": "痛点二：信息层级不清，增加理解与判断的负担。"
        },
        {
          "src": "/work/hyundai/13-yi5tIZX6ktjdCQxCRhli3fVss.png",
          "width": 1920,
          "height": 539,
          "alt": "痛点三：及时反馈不足，驾驶者难以确认辅助系统的行为。",
          "caption": "痛点三：及时反馈不足，驾驶者难以确认辅助系统的行为。"
        }
      ]
    },
    {
      "chapter": "设计",
      "heading": "把研究转化为界面要求",
      "body": "最初的设计要求很具体：让 HDA 的进入与退出有明确变化，区分辅助开启与中断状态，并在不遮挡驾驶视图的前提下呈现重要反馈。每项要求都对应研究中发现的痛点，再落实为界面需要传达的状态与行为。",
      "figures": [
        {
          "src": "/work/hyundai/14-C20yLBCr3JF3wok870qhrckDJNI.png",
          "width": 1920,
          "height": 853,
          "alt": "早期设计要求：清晰呈现 HDA 开启与退出时的界面变化。",
          "caption": "早期设计要求：清晰呈现 HDA 开启与退出时的界面变化。"
        },
        {
          "src": "/work/hyundai/15-ZeSXMnW6LTHJiaUUfq8oyNpTj1s.png",
          "width": 1920,
          "height": 860,
          "alt": "早期设计要求：明确区分辅助功能的开启、关闭与中断状态。",
          "caption": "早期设计要求：明确区分辅助功能的开启、关闭与中断状态。"
        },
        {
          "src": "/work/hyundai/16-W7U6uMWIbEF2LAgu8PJzSpk0o.png",
          "width": 1920,
          "height": 887,
          "alt": "早期设计要求：提供必要反馈，同时避免遮挡驾驶状态可视化。",
          "caption": "早期设计要求：提供必要反馈，同时避免遮挡驾驶状态可视化。"
        }
      ]
    },
    {
      "chapter": "设计",
      "heading": "先探索信息层级，再细化视觉",
      "body": "低保真原型把驾驶状态与次要信息分开，探索手动驾驶、辅助开启、车道检测和拥堵交通等场景的布局。把这些状态放在一起比较，让我们更容易判断哪些信息应保持稳定、哪些内容应随驾驶模式变化。",
      "figures": [
        {
          "src": "/work/hyundai/17-Gw3LafFg3OQvBcnlE2vnJ5BB4.png",
          "width": 1920,
          "height": 898,
          "alt": "辅助驾驶、手动驾驶及欢迎状态的低保真布局。",
          "caption": "辅助驾驶、手动驾驶及欢迎状态的低保真布局。"
        },
        {
          "src": "/work/hyundai/18-UMt3dEIanp6ydOqBeXZHVQgWak.png",
          "width": 1920,
          "height": 932,
          "alt": "车道检测、拥堵交通及次要信息的低保真探索。",
          "caption": "车道检测、拥堵交通及次要信息的低保真探索。"
        },
        {
          "src": "/work/hyundai/19-zO9dwRDgBiQsFfGRXzj2DZaBlc.png",
          "width": 1920,
          "height": 943,
          "alt": "原有仪表、简化布局与早期概念的对照。",
          "caption": "原有仪表、简化布局与早期概念的对照。"
        }
      ]
    },
    {
      "chapter": "设计",
      "heading": "围绕完整状态迭代",
      "body": "探索进一步扩展为一组完整的仪表状态。布局、车辆图示、状态表达与反馈被同步推敲，让方案能够呈现辅助功能的变化，而不只停留在单个静态画面。",
      "figures": [
        {
          "src": "/work/hyundai/20-P0bKPXtryxRW3RqTz2cENvRH1c.png",
          "width": 2017,
          "height": 2178,
          "alt": "围绕车辆状态、布局与状态提示展开的界面迭代。",
          "caption": "围绕车辆状态、布局与状态提示展开的界面迭代。"
        }
      ]
    },
    {
      "chapter": "设计",
      "heading": "建立一致的视觉语言",
      "body": "设计系统把字体、图标、色彩、车辆图示与驾驶辅助组件整合为统一的视觉语言。组件设计重点区分常规运行、辅助开启以及需要驾驶者注意的状态，让这些变化更容易被识别。",
      "figures": [
        {
          "src": "/work/hyundai/21-8aYvczjxqWB6dxJ3uRAN3uOtcD0.png",
          "width": 2284,
          "height": 2286,
          "alt": "涵盖车辆可视化与驾驶辅助状态的设计系统。",
          "caption": "涵盖车辆可视化与驾驶辅助状态的设计系统。"
        },
        {
          "src": "/work/hyundai/22-otF4o2N7Teb8perjWU6BpaRak.png",
          "width": 2010,
          "height": 1438,
          "alt": "HDA 界面的字体、图标、色彩与组件规范。",
          "caption": "HDA 界面的字体、图标、色彩与组件规范。"
        }
      ]
    },
    {
      "chapter": "设计",
      "heading": "测试三种设计方向",
      "body": "我们设计了三种用于比较的界面方向。白色方案建立极简基线；绿色方案强调安心感与清晰的辅助反馈；蓝色方案探索更偏技术与信息表达的呈现方式。随后通过驾驶任务和参与者反馈比较这三种方案。",
      "figures": [
        {
          "src": "/work/hyundai/23-jaxRc28lz0aHp6OWEBZEMKEz8U.png",
          "width": 695,
          "height": 298,
          "alt": "白色方案：用于对照的极简基线界面。",
          "caption": "白色方案：用于对照的极简基线界面。"
        },
        {
          "src": "/work/hyundai/24-qq5Tkwsr8qChWGTdrpc5ZXIBbXc.png",
          "width": 722,
          "height": 305,
          "alt": "绿色方案：强调安心感与辅助状态的清晰表达。",
          "caption": "绿色方案：强调安心感与辅助状态的清晰表达。"
        },
        {
          "src": "/work/hyundai/25-LFbMsUXOF7jYObwUFIJEYutXdHo.png",
          "width": 738,
          "height": 299,
          "alt": "蓝色方案：原研究中侧重技术信息表达的设计方向。",
          "caption": "蓝色方案：原研究中侧重技术信息表达的设计方向。"
        }
      ]
    },
    {
      "chapter": "验证",
      "heading": "第二轮：比较、共创与改进",
      "body": "第二轮结合界面视觉测试，以及模拟器与实车中的功能测试。白板共创让参与者重新排列信息，并说明不同驾驶模式下的需求。反馈指向一种自适应的信息层级：手动驾驶时速度信息更重要，辅助功能开启后，车辆状态可视化的作用则更突出。",
      "figures": [
        {
          "src": "/work/hyundai/26-110f5s2DIHjMsDIVmEjPPQS9yc.png",
          "width": 1637,
          "height": 695,
          "alt": "第二轮研究计划：界面视觉测试与模拟器、实车功能测试。",
          "caption": "第二轮研究计划：界面视觉测试与模拟器、实车功能测试。"
        },
        {
          "src": "/work/hyundai/27-5hRoOXdNJIPAd8PfoEPDjrHaBI.png",
          "width": 1646,
          "height": 448,
          "alt": "从共同设计、整理反馈到下一轮迭代的测试流程。",
          "caption": "从共同设计、整理反馈到下一轮迭代的测试流程。"
        },
        {
          "src": "/work/hyundai/28-vSBKw1QTiEgdwMXpRJ1AGPOHdP8.png",
          "width": 1691,
          "height": 666,
          "alt": "用于排列仪表信息的白板共创练习。",
          "caption": "用于排列仪表信息的白板共创练习。"
        },
        {
          "src": "/work/hyundai/29-BDVHagqGHsMAZk7HC0hJBBLAc.png",
          "width": 1690,
          "height": 572,
          "alt": "关于不同驾驶模式下信息密度、层级与车辆可视化的发现。",
          "caption": "关于不同驾驶模式下信息密度、层级与车辆可视化的发现。"
        }
      ]
    },
    {
      "chapter": "验证",
      "heading": "让信心成为可比较的指标",
      "body": "研究使用自定义信心评分，把生理信号、任务耗时与主观反馈纳入共同的分析框架。文档记录了数据整理、时间对齐与权重设置的方法；处理流程也区分已实现的输入，以及计划加入的面部情绪和眼动数据扩展，为后续改进保留空间。",
      "figures": [
        {
          "src": "/work/hyundai/30-aBMoQB7KSCKsbuVVjNicAaBKL8.png",
          "width": 1920,
          "height": 967,
          "alt": "信心评分的计算方式，以及数据整理、时间戳与参数。",
          "caption": "信心评分的计算方式，以及数据整理、时间戳与参数。"
        },
        {
          "src": "/work/hyundai/31-LkGHOBtn2MqcVPzCmrmK2eUHaA.png",
          "width": 1747,
          "height": 1126,
          "alt": "信心数据处理流程，区分已实现的输入与计划扩展的数据来源。",
          "caption": "信心数据处理流程，区分已实现的输入与计划扩展的数据来源。"
        }
      ]
    },
    {
      "chapter": "验证",
      "heading": "绿色方案在原型比较中表现最佳",
      "body": "项目研究报告显示，绿色方案获得最高信心评分，**相比原有界面提升 10%**。对比图呈现了三种方案在所展示参与者中的表现。这一结果推动最终原型继续强化辅助状态的表达，并让信息随驾驶模式调整。",
      "figures": [
        {
          "src": "/work/hyundai/32-ScvQ6mqHJGWuNJUYe2uk2Fwig.png",
          "width": 2366,
          "height": 1160,
          "alt": "白、绿、蓝三种界面方向的信心评分对比。",
          "caption": "白、绿、蓝三种界面方向的信心评分对比。"
        }
      ],
      "callout": {
        "variant": "insight",
        "label": "原型研究",
        "title": "信心评分提升 10%",
        "text": "绿色方案与本项目原型研究中的原有界面相比。"
      }
    },
    {
      "chapter": "验证",
      "heading": "比较模拟与实车驾驶指标",
      "body": "团队使用配对样本分析，比较同一参与者在模拟与实车驾驶中的指标。分析涵盖信心评分、体验问卷、瞳孔大小、心率变异性及任务耗时，从多个角度观察两种环境下的体验。",
      "figures": [
        {
          "src": "/work/hyundai/33-23hGPel2buNxH6CsZlIgn3yoA.png",
          "width": 2006,
          "height": 1518,
          "alt": "比较模拟与实车驾驶指标的配对样本分析流程。",
          "caption": "比较模拟与实车驾驶指标的配对样本分析流程。"
        }
      ],
      "table": {
        "headers": [
          "指标",
          "来源",
          "观察重点"
        ],
        "rows": [
          [
            "信心评分",
            "自定义信心指标",
            "确定感与舒适程度"
          ],
          [
            "体验自评",
            "定制界面问卷",
            "易用性、清晰度与满意度"
          ],
          [
            "瞳孔大小",
            "Tobii Pro Glasses 2",
            "认知负荷分析所参考的信号"
          ],
          [
            "心率变异性（RMSSD）",
            "Polar Beat 心电数据",
            "驾驶任务中的生理变化"
          ],
          [
            "任务耗时",
            "模拟器与实车交互记录",
            "完成任务的耗时与阻碍"
          ]
        ]
      }
    },
    {
      "chapter": "最终方案",
      "heading": "形成清晰的辅助反馈体系",
      "body": "最终绿色界面结合紧凑状态面板、中央车辆图示与独立的转向辅助指示。动态图标区分暂停和开启状态，车道保持与跟车距离反馈则帮助驾驶者理解系统当前行为。信息密度随驾驶模式变化。",
      "figures": [
        {
          "src": "/work/hyundai/34-5IyC25uNYsrDAOeXKpkiHenz0.png",
          "width": 1344,
          "height": 504,
          "alt": "最终绿色界面：速度、车辆可视化与转向辅助状态。",
          "caption": "最终绿色界面：速度、车辆可视化与转向辅助状态。"
        },
        {
          "src": "/work/hyundai/35-ookBJb3Uz94g31o1CfOgfNJKuU.png",
          "width": 1681,
          "height": 437,
          "alt": "状态面板组件：紧凑图标与展开后的反馈信息。",
          "caption": "状态面板组件：紧凑图标与展开后的反馈信息。"
        },
        {
          "src": "/work/hyundai/36-ljMLsTsb8QvvAye1iso5NGUV98.png",
          "width": 1526,
          "height": 438,
          "alt": "通过中央车辆图示传达当前驾驶状态。",
          "caption": "通过中央车辆图示传达当前驾驶状态。"
        },
        {
          "src": "/work/hyundai/37-6K9aCro6E1YotRDDfEzfd9VgoQ.png",
          "width": 1698,
          "height": 438,
          "alt": "用于指示系统转向辅助状态的组件。",
          "caption": "用于指示系统转向辅助状态的组件。"
        }
      ]
    },
    {
      "chapter": "最终方案",
      "heading": "观看动态原型",
      "body": "三个动态原型片段展示绿色界面的运行方式，让组件之间的状态变化与持续反馈变得可见。",
      "videos": [
        {
          "src": "/work/hyundai/38-cJ5hmjRXuoVOmDgREXP3ITTL40Q.mp4",
          "title": "车道保持辅助演示",
          "poster": "/work/hyundai/38-cJ5hmjRXuoVOmDgREXP3ITTL40Q.jpg",
          "width": 1280,
          "height": 720
        },
        {
          "src": "/work/hyundai/39-l0DDD6WliFV35oQWjXtGMEokdm0.mp4",
          "title": "跟车距离演示",
          "poster": "/work/hyundai/39-l0DDD6WliFV35oQWjXtGMEokdm0.jpg",
          "width": 1280,
          "height": 720
        },
        {
          "src": "/work/hyundai/40-87uEUPs8PzUhntr9n1wPYjuPUQ.mp4",
          "title": "高速公路驾驶辅助演示",
          "poster": "/work/hyundai/40-87uEUPs8PzUhntr9n1wPYjuPUQ.jpg",
          "width": 1280,
          "height": 720
        }
      ]
    },
    {
      "chapter": "最终方案",
      "heading": "远景概念：让反馈更靠近驾驶者",
      "body": "远景概念探索将显示屏置于方向盘上，并让中央屏幕在方向盘转动时保持固定。草图与屏幕方案同时考虑缩短视线移动、提供更直接反馈的潜力，以及运动、内容旋转和认知负荷带来的挑战。这是一个仍需继续探索的概念方向。",
      "figures": [
        {
          "src": "/work/hyundai/41-AfwBikWkicZ3wWB4i2ytlw6Y.png",
          "width": 1638,
          "height": 539,
          "alt": "围绕座舱体验与驾驶控制交接提出的远景问题。",
          "caption": "围绕座舱体验与驾驶控制交接提出的远景问题。"
        },
        {
          "src": "/work/hyundai/42-I4SNQypWkbBh26V67x9BVf8pww.png",
          "width": 1818,
          "height": 815,
          "alt": "方向盘屏幕概念，以及视线移动、可见性和运动带来的权衡。",
          "caption": "方向盘屏幕概念，以及视线移动、可见性和运动带来的权衡。"
        },
        {
          "src": "/work/hyundai/43-kSacItoVGazhESQU5bOUPsjcWnU.png",
          "width": 1920,
          "height": 970,
          "alt": "探索方向盘屏幕与仪表布局的概念草图。",
          "caption": "探索方向盘屏幕与仪表布局的概念草图。"
        },
        {
          "src": "/work/hyundai/44-oD6r2ChRHgEdXBXuVv15ZaH4.png",
          "width": 1856,
          "height": 787,
          "alt": "方向盘转动时中央屏幕保持固定的概念方案。",
          "caption": "方向盘转动时中央屏幕保持固定的概念方案。"
        },
        {
          "src": "/work/hyundai/45-eNyGe4QiR6djhgWTdowVMqJxNwA.png",
          "width": 1878,
          "height": 935,
          "alt": "驾驶信息、车辆状态与控制交接提示的屏幕方案探索。",
          "caption": "驾驶信息、车辆状态与控制交接提示的屏幕方案探索。"
        }
      ]
    },
    {
      "chapter": "最终方案",
      "heading": "下一步的研究环境",
      "body": "座舱效果图把方向盘概念与主显示屏放进更完整的车内体验。后续方向包括加强模拟器与界面的联动，让驾驶者通过交互理解辅助系统，并加入更复杂的城市场景；同时继续邀请熟悉现代车辆的驾驶者参与测试，研究此次反馈中出现的较大差异。",
      "figures": [
        {
          "src": "/work/hyundai/46-FE4DlXRLVGyhVA5RvjRrhlkVXBQ.png",
          "width": 1922,
          "height": 1082,
          "alt": "远景座舱效果图：在方向盘内设置紧凑信息屏幕。",
          "caption": "远景座舱效果图：在方向盘内设置紧凑信息屏幕。"
        },
        {
          "src": "/work/hyundai/47-OArtUZF2KYxCy5eE2AOpLXpzJwI.png",
          "width": 1920,
          "height": 1080,
          "alt": "远景座舱效果图：连接方向盘反馈与主显示屏。",
          "caption": "远景座舱效果图：连接方向盘反馈与主显示屏。"
        }
      ]
    }
  ]
};

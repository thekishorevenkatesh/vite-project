export const STEPS = [
  {
    id: "step_002",
    name: "Lid open",
    description: "Open the petrol lid to fill fuel",
    functionalComponent: [
      {
        component: "FUEL_TANK",
        attributeInitialValues: [
          { uniqueIdentifier: "FUEL_TANK", initialValue: "OPEN" }
        ]
      }
    ],
    nonFunctionalComponent: [],
    assets: [],
    tenantId: "tvs_training_001"
  },
  {
    id: "step_003",
    name: "Fill the fuel",
    description: "Fill fuel using funnel and fuel can",
    functionalComponent: [
      {
        component: "FUEL_CAN",
        attributeInitialValues: [
          { uniqueIdentifier: "FUEL_CAN", initialValue: 1 }
        ]
      }
    ],
    nonFunctionalComponent: [],
    assets: [],
    tenantId: "tvs_training_001"
  },
  {
    id: "step_004",
    name: "Check SideStand",
    description: "Retract the side stand",
    functionalComponent: [
      {
        component: "SIDE_STAND",
        attributeInitialValues: [
          { uniqueIdentifier: "SIDE_STAND", initialValue: "UP" }
        ]
      }
    ],
    nonFunctionalComponent: [],
    assets: [],
    tenantId: "tvs_training_001"
  },
  {
    id: "step_001",
    name: "Turn ON Ignition Key",
    description:
      "Switch the ignition key to the ON position to enable system checks before fuel filling.",
    functionalComponent: [
      {
        component: "IGNITION_KEY",
        attributeInitialValues: [
          { uniqueIdentifier: "IGNITION_KEY", initialValue: "OFF" }
        ]
      }
    ],
    nonFunctionalComponent: [],
    assets: [],
    tenantId: "tvs_training_001"
  },
  {
    id: "step_005",
    name: "Kill Switch",
    description: "Turn off kill switch",
    functionalComponent: [
      {
        component: "KILL_SWITCH",
        attributeInitialValues: [
          { uniqueIdentifier: "KILL_SWITCH", initialValue: "ON" }
        ]
      }
    ],
    nonFunctionalComponent: [],
    assets: [],
    tenantId: "tvs_training_001"
  }
];

import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import pfDashboardRouter from "./pf/dashboard";
import pfClientsRouter from "./pf/clients";
import pfProposalsRouter from "./pf/proposals";
import pfContractsRouter from "./pf/contracts";
import pfDepositsRouter from "./pf/deposits";
import alDashboardRouter from "./al/dashboard";
import alPropertiesRouter from "./al/properties";
import alLeadsRouter from "./al/leads";
import alDealsRouter from "./al/deals";
import alRemindersRouter from "./al/reminders";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(pfDashboardRouter);
router.use(pfClientsRouter);
router.use(pfProposalsRouter);
router.use(pfContractsRouter);
router.use(pfDepositsRouter);
router.use(alDashboardRouter);
router.use(alPropertiesRouter);
router.use(alLeadsRouter);
router.use(alDealsRouter);
router.use(alRemindersRouter);

export default router;

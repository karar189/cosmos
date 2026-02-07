/** @jsxImportSource @emotion/react */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AccountType } from '@/components/forms/AccountType';
import { Individual } from '@/components/forms/Individual';
import { WorkspaceType } from '@/components/forms/WorkspaceType';
import { AccessForm } from '@/components/forms/AccessForm';
import { TelegramGroupForm } from '@/components/forms/TelegramGroupForm';
import { Researcher } from '@/components/forms/Researcher';
import { Loading } from '@/components/forms/Loading';
import { Signup } from '@/components/forms/Signup';
import { Verify } from '@/components/forms/Verify';
import { Password } from '@/components/forms/Password';
import { FormBox } from '@core3/ui-components';
import {
  RequestAccess,
  RequestedAccess,
} from '@/components/forms/RequestAccess';
import { CreateProject } from '@/components/forms/CreateProject';
import { useAuthLayout } from '@/components/layouts/AuthLayout/AuthLayoutContext';
import { ROUTES } from '@/constants/routes';
import { SignUpStep } from '@/enums/signupEnum';
import { useProjectsStatistic } from '@/hooks';
import { AccountStep } from '@/enums/accountEnum';
import { IndividualStep, OrganizationStep } from '@/enums/workspaceEnum';

export interface Project {
  projectName: string;
  projectLogo: string;
}

const SignUpFlow = () => {
  // TEMPORARY: Redirect to homepage - auth is disabled
  const router = useRouter();
  useEffect(() => {
    router.push(ROUTES.HOME);
  }, [router]);
  
  return null; // Render nothing while redirecting
  
  // Original code below - will be re-enabled when auth is restored
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const { data: projectsStatistics } = useProjectsStatistic();

  const { setIsLoading } = useAuthLayout();
  const [step, setStep] = useState<SignUpStep>(SignUpStep.SIGNUP);
  const [workspaceType, setWorkspaceType] = useState<OrganizationStep | null>(
    null
  );

  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // TODO: Add refetch projects statistics

  useEffect(() => {
    if (projectsStatistics) {
      const getProjects = projectsStatistics.projectsList.list.map(
        (project) => ({
          projectName: project.project.name,
          projectLogo: project.project.logo,
        })
      );
      setProjects(getProjects);
    }
  }, [projectsStatistics]);

  // Sync loading state with layout
  useEffect(() => {
    setIsLoading(step === SignUpStep.LOADING);
  }, [step, setIsLoading]);

  const handleSignupContinue = (step: SignUpStep) => {
    setStep(step);
  };

  const handleVerifyContinue = (step: SignUpStep) => {
    switch (step) {
      case SignUpStep.PASSWORD:
        setStep(SignUpStep.PASSWORD);
        break;
      case SignUpStep.SIGNUP:
      default:
        setStep(SignUpStep.SIGNUP);
        break;
    }
  };

  const handlePasswordContinue = () => {
    setStep(SignUpStep.ACCOUNT_TYPE);
  };

  const handleAccountTypeSelect = (type: AccountStep) => {
    switch (type) {
      case AccountStep.Organization:
        setStep(SignUpStep.WORKSPACE_TYPE);
        break;
      case AccountStep.Individual:
      default:
        setStep(SignUpStep.INDIVIDUAL_WORKSPACE);
        break;
    }
  };

  const handleIndividualWorkspaceContinue = (type: IndividualStep) => {
    // Store account type for individuals
    if (type === IndividualStep.Researcher) {
      localStorage.setItem('accountType', 'researcher');
      localStorage.setItem('isLoggedIn', 'true');
      setStep(SignUpStep.RESEARCHER_FORM);
    } else if (type === IndividualStep.Investor) {
      localStorage.setItem('accountType', 'investor');
      // For investors, we need to get name from signup email or use placeholder
      // TODO: Add a form step to collect first/last name for individuals
      const email = localStorage.getItem('signupEmail') || '';
      const emailName = email.split('@')[0];
      localStorage.setItem('userEmail', email);
      localStorage.setItem('firstName', emailName);
      localStorage.setItem('lastName', 'User'); // Placeholder
      localStorage.setItem('isLoggedIn', 'true');
      
      setStep(SignUpStep.LOADING);
      router.push(ROUTES.RATINGS.PROJECTS);
    }
  };

  const handleWorkspaceTypeContinue = (type: OrganizationStep) => {
    setWorkspaceType(type);
    setStep(SignUpStep.ACCESS_FORM);
  };

  const handleAccessFormContinue = (data: {
    corporateEmail: string;
    fullName: string;
    projectName: string;
    numberOfLicensedProjects?: string;
  }) => {
    // Store user data in localStorage
    const [firstName, ...lastNameParts] = data.fullName.split(' ');
    const lastName = lastNameParts.join(' ') || firstName; // Fallback if no last name
    
    localStorage.setItem('userEmail', data.corporateEmail);
    localStorage.setItem('firstName', firstName);
    localStorage.setItem('lastName', lastName);
    localStorage.setItem('organizationName', data.projectName);
    localStorage.setItem('isLoggedIn', 'true');
    
    // Set account type based on workspace type
    if (workspaceType === OrganizationStep.Regulator) {
      localStorage.setItem('accountType', 'regulator');
    } else if (workspaceType === OrganizationStep.Project) {
      localStorage.setItem('accountType', 'project');
    } else if (workspaceType === OrganizationStep.CREATE_EXCHANGE) {
      localStorage.setItem('accountType', 'exchange');
    }

    switch (workspaceType) {
      case OrganizationStep.Regulator:
        setStep(SignUpStep.TELEGRAM_GROUP);
        break;
      case OrganizationStep.Project: {
        const projectExists = projects.find(
          (project) => project.projectName === data.projectName
        );

        if (projectExists) {
          setSelectedProject(projectExists);
          setStep(SignUpStep.REQUEST_ACCESS);
        } else {
          setStep(SignUpStep.CREATE_PROJECT);
        }
        break;
      }
      case OrganizationStep.CREATE_EXCHANGE:
        setStep(SignUpStep.CREATE_PROJECT);
        break;
      default:
        break;
    }
  };

  const handleTelegramGroupSubmit = (_data: { telegramLink: string }) => {
    // Regulator data should already be stored in handleAccessFormContinue
    // Just complete the flow
    setStep(SignUpStep.LOADING);
    router.push(ROUTES.WORKSPACE.ROOT);
  };

  const handleRequestAccessContinue = () => {
    setStep(SignUpStep.REQUESTED_ACCESS);
  };

  const handleCreateProjectContinue = () => {
    // Project/Exchange data should already be stored in handleAccessFormContinue
    // Complete the flow and redirect to workspace
    setStep(SignUpStep.LOADING);
    router.push(ROUTES.WORKSPACE.ROOT);
  };

  const handleBackClick = () => {
    switch (step) {
      case SignUpStep.TELEGRAM_GROUP:
        setStep(SignUpStep.ACCESS_FORM);
        break;
      case SignUpStep.ACCESS_FORM:
        setStep(SignUpStep.WORKSPACE_TYPE);
        break;
      case SignUpStep.REQUEST_ACCESS:
        setStep(SignUpStep.ACCESS_FORM);
        break;
      case SignUpStep.REQUESTED_ACCESS:
        setStep(SignUpStep.REQUEST_ACCESS);
        break;
      case SignUpStep.WORKSPACE_TYPE:
        setStep(SignUpStep.ACCOUNT_TYPE);
        break;
      case SignUpStep.INDIVIDUAL_WORKSPACE:
        setStep(SignUpStep.ACCOUNT_TYPE);
        break;
      case SignUpStep.RESEARCHER_FORM:
        setStep(SignUpStep.INDIVIDUAL_WORKSPACE);
        break;
      case SignUpStep.CREATE_PROJECT:
        setStep(SignUpStep.ACCESS_FORM);
        break;
      case SignUpStep.ACCOUNT_TYPE:
        setStep(SignUpStep.PASSWORD);
        break;
      case SignUpStep.PASSWORD:
        setStep(SignUpStep.VERIFY);
        break;
      case SignUpStep.VERIFY:
        setStep(SignUpStep.SIGNUP);
        break;
      default:
        break;
    }
  };

  const getHeaderProps = () => {
    const email = localStorage.getItem('signupEmail') || '';
    const commonProps = {
      email,
      onBackClick: handleBackClick,
    };

    switch (step) {
      case SignUpStep.INDIVIDUAL_WORKSPACE:
        return {
          ...commonProps,
          backText: 'Change account type',
        };
      case SignUpStep.RESEARCHER_FORM:
        return {
          ...commonProps,
          backText: 'Change workspace type',
        };
      case SignUpStep.WORKSPACE_TYPE:
        return {
          ...commonProps,
          backText: 'Change account type',
        };
      case SignUpStep.ACCESS_FORM:
        return {
          ...commonProps,
          backText: 'Change workspace type',
        };
      case SignUpStep.REQUEST_ACCESS:
        return {
          ...commonProps,
          backText: 'Change access form',
        };
      case SignUpStep.REQUESTED_ACCESS:
        return {
          ...commonProps,
          backText: 'Change request access',
        };
      case SignUpStep.TELEGRAM_GROUP:
        return {
          ...commonProps,
          backText: 'Change workspace type',
        };
      case SignUpStep.CREATE_PROJECT:
        return {
          ...commonProps,
          backText: 'Change access form',
        };
      case SignUpStep.ACCOUNT_TYPE:
        return {
          ...commonProps,
          backText: 'Change password',
        };
      case SignUpStep.PASSWORD:
        return {
          ...commonProps,
          backText: 'Change verification',
        };
      case SignUpStep.VERIFY:
        return {
          ...commonProps,
          backText: 'Change email',
        };
      default:
        return undefined;
    }
  };

  const renderForm = () => {
    switch (step) {
      case SignUpStep.SIGNUP:
        return <Signup setStep={handleSignupContinue} />;
      case SignUpStep.VERIFY:
        return <Verify setStep={handleVerifyContinue} />;
      case SignUpStep.PASSWORD:
        return <Password onContinue={handlePasswordContinue} />;
      case SignUpStep.ACCOUNT_TYPE:
        return <AccountType onSelect={handleAccountTypeSelect} />;
      case SignUpStep.INDIVIDUAL_WORKSPACE:
        return <Individual onContinue={handleIndividualWorkspaceContinue} />;
      case SignUpStep.RESEARCHER_FORM:
        return <Researcher />;
      case SignUpStep.WORKSPACE_TYPE:
        return <WorkspaceType onContinue={handleWorkspaceTypeContinue} />;
      case SignUpStep.LOADING:
        return <Loading />;
      case SignUpStep.ACCESS_FORM:
        if (!workspaceType) return null;
        return (
          <AccessForm
            onContinue={handleAccessFormContinue}
            currentStep={0}
            workspaceType={workspaceType}
          />
        );
      case SignUpStep.REQUEST_ACCESS:
        return selectedProject ? (
          <RequestAccess
            currentStep={0}
            workspaceType={workspaceType!}
            onContinue={handleRequestAccessContinue}
            project={selectedProject}
          />
        ) : null;
      case SignUpStep.REQUESTED_ACCESS:
        return (
          <RequestedAccess
            workspaceType={workspaceType!}
            onBackToHome={() => {
              router.push(ROUTES.AUTH.LOGIN);
            }}
          />
        );
      case SignUpStep.TELEGRAM_GROUP:
        if (workspaceType !== OrganizationStep.Regulator) return null;
        return (
          <TelegramGroupForm
            onSubmit={handleTelegramGroupSubmit}
            currentStep={1}
            workspaceType={workspaceType}
          />
        );
      case SignUpStep.CREATE_PROJECT:
        return (
          <CreateProject
            onContinue={handleCreateProjectContinue}
            currentStep={0}
            workspaceType={workspaceType!}
          />
        );
      default:
        return null;
    }
  };

  return <FormBox headerProps={getHeaderProps()}>{renderForm()}</FormBox>;
};

export default SignUpFlow;

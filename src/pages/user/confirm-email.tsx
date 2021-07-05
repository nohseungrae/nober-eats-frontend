import { gql, useApolloClient, useMutation } from '@apollo/client';
import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useMe } from '../../hooks/useMe';
import { verifyEmail, verifyEmailVariables } from '../../__generated__/verifyEmail';

const VERIFY_EMAIL_MUTATION = gql`
    mutation verifyEmail($input: VerifyEmailInput!) {
        verifyEmail(input: $input) {
            ok
            error
        }
    }
`;

export const ConfirmEmail = () => {
    const { data: userData } = useMe();
    const client = useApolloClient();
    const history = useHistory();
    const onCompleted = (data: verifyEmail) => {
        const {
            verifyEmail: { ok },
        } = data;
        if (ok && userData?.me.id) {
            client.writeFragment({
                id: `User:${userData.me.id}`,
                fragment: gql`
                    fragment VerifiedUser on User {
                        verified
                    }
                `,
                data: {
                    verified: true,
                },
            });
            // 여기서 warning이 발생한다. 왜냐하면 Promise인 상태로 다른 페이지로 넘어갔기 때문에!
            history.push('/');
        }
    };

    const [verifyEmail] = useMutation<verifyEmail, verifyEmailVariables>(VERIFY_EMAIL_MUTATION, { onCompleted });
    useEffect(() => {
        const [_, code] = window.location.href.split('code=');
        //여기서 home으로 갔음에도 불구하고 업데이트를 하려 하기 때문에 warning이 일어남
        verifyEmail({
            variables: {
                input: {
                    code,
                },
            },
        });
    }, []);
    return (
        <div className="mt-52 flex flex-col items-center justify-center">
            <h2 className="text-lg mb-1 font-medium">Confirming email...</h2>
            <h4 className="text-gray-700 text-sm">Please wait, don't close this page...</h4>
        </div>
    );
};

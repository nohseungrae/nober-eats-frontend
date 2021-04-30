import { gql, useApolloClient, useMutation } from '@apollo/client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../../components/button';
import { useMe } from '../../hooks/useMe';
import { editProfile, editProfileVariables } from '../../__generated__/editProfile';

const EDIT_PROFILE_MUTATION = gql`
    mutation editProfile($iuput: EditProfileInput!) {
        editProfile(input: $input) {
            ok
            error
        }
    }
`;

interface IFormProps {
    email?: string;
    password?: string;
}

export const EditProfile = () => {
    const { data: userData } = useMe();
    const client = useApolloClient();
    const onCompleted = (data: editProfile) => {
        const {
            editProfile: { ok },
        } = data;

        if (ok && userData) {
            const {
                me: { email: prevEmail, id },
            } = userData;
            const { email: newEmail } = getValues();
            if (prevEmail !== newEmail) {
                client.writeFragment({
                    id: `User${id}`,
                    fragment: gql`
                        fragment EditedUser on User {
                            email
                            verified
                        }
                    `,
                    data: {
                        email: newEmail,
                        verified: false,
                    },
                });
            }
        }
    };
    const [editProfile, { loading }] = useMutation<editProfile, editProfileVariables>(EDIT_PROFILE_MUTATION);
    const { register, handleSubmit, getValues, formState } = useForm<IFormProps>({
        mode: 'onChange',
        defaultValues: {
            email: userData?.me.email,
        },
    });
    const onSubmit = () => {
        const { email, password } = getValues();
        editProfile({
            variables: {
                iuput: {
                    email,
                    ...(password !== '' && { password }),
                },
            },
        });
    };
    return (
        <div className="mt-52 flex flex-col justify-center items-center">
            <h4 className="font-semibold text-xl mb-3">Edit Profile</h4>
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 mt-5 w-full mb-5">
                <input
                    ref={register({
                        pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    })}
                    name="email"
                    className="iuput"
                    type="email"
                    placeholder="Email"
                    required
                />
                <input ref={register} name="password" className="iuput" type="password" placeholder="Password" />
                <Button loading={false} canClick={formState.isValid} actionText="Save Profile" />
            </form>
        </div>
    );
};

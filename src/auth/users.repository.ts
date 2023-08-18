import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { EntityRepository, Repository } from "typeorm";
import { User } from "./user.entity";
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
    async createUser(AuthCredentialsDto: AuthCredentialsDto): Promise<void> {
        const { username, password } = AuthCredentialsDto;

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = this.create({ username, password: hashedPassword })

        try {
            await this.save(user);
        } catch (error) {
            if(error.code === '23505'){
                throw new ConflictException('username already exists')
            }else{
                throw new InternalServerErrorException()
            }
        }
    }
}